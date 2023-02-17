"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.ClientService = void 0;
var eventemitter2_1 = __importDefault(require("eventemitter2"));
var uuid_1 = require("uuid");
var Client = /** @class */ (function (_super) {
    __extends(Client, _super);
    function Client(socket) {
        var _this = _super.call(this) || this;
        _this.name = '';
        _this.heartbeatInterval = null;
        _this.isAlive = true;
        _this.id = (0, uuid_1.v4)();
        _this.ws = socket;
        _this.init();
        console.info("New client ".concat(_this.id));
        return _this;
    }
    Client.prototype.toString = function () {
        return this.name || this.id;
    };
    Client.prototype.send = function (message) {
        this.ws.send(message);
    };
    Client.prototype.init = function () {
        var _this = this;
        // Respond to pings from client
        this.ws.on('ping', function () {
            _this.ws.pong();
        });
        this.ws.on('pong', function () {
            _this.isAlive = true;
        });
        this.ws.on('close', function () {
            _this.connectionClosed();
        });
        this.ws.on('error', function (error) {
            console.log(error);
        });
        this.ws.on('message', function (data) {
            _this.handleMessage(data);
        });
        // Ping the client on interval
        this.heartbeatInterval = setInterval(this.heartbeat.bind(this), 20000);
    };
    Client.prototype.heartbeat = function () {
        // if we havn't received a pong since last heartbeat, consider connection lost
        if (this.isAlive === false) {
            this.ws.terminate();
            this.connectionClosed();
        }
        this.isAlive = false;
        this.ws.ping();
    };
    Client.prototype.connectionClosed = function () {
        this.isAlive = false;
        this.ws.terminate();
        this.emit('disconnected', this);
    };
    Client.prototype.handleMessage = function (message) {
        var _a = message.toString().split('::'), action = _a[0], data = _a[1];
        if (action && data) {
            try {
                console.log('emitting message', { action: action, data: data });
                this.emit(action, this, JSON.parse(data));
            }
            catch (error) {
                if (error instanceof SyntaxError) {
                    console.error("Invalid json in incoming message ".concat(message));
                }
            }
        }
        else {
            console.error("Malformed incoming message ".concat(message));
        }
    };
    return Client;
}(eventemitter2_1["default"]));
var Room = /** @class */ (function (_super) {
    __extends(Room, _super);
    function Room(code) {
        var _this = _super.call(this) || this;
        _this.clientMap = {};
        _this.voteMap = {};
        _this.code = code;
        _this.boundClientVoted = _this.clientVoted.bind(_this);
        _this.boundClientDisconnected = _this.clientDisconnected.bind(_this);
        _this.boundClientJoinedAnotherRoom = _this.clientJoinedAnotherRoom.bind(_this);
        _this.boundClearVotes = _this.clearVotes.bind(_this);
        console.info("New Room ".concat(_this.code));
        return _this;
    }
    Room.prototype.addClient = function (client) {
        this.clientMap[client.id] = client;
        client.on('vote', this.boundClientVoted);
        client.on('clearVotes', this.boundClearVotes);
        client.once('disconnected', this.boundClientDisconnected);
        this.sendAll('clientUpdate', JSON.stringify(this.clientData()));
        console.info("Client: ".concat(client, " Joined room: ").concat(this.code));
    };
    Room.prototype.clearVotes = function () {
        this.voteMap = {};
        this.sendVotes();
    };
    Room.prototype.clientData = function () {
        var result = [];
        console.log(this.voteMap);
        for (var clientId in this.clientMap) {
            var client = this.clientMap[clientId];
            var vote = this.voteMap[clientId];
            result.push({
                name: client.name,
                id: client.id,
                currentVote: typeof vote === 'number' ? vote : null
            });
        }
        return result;
    };
    Room.prototype.clientJoinedAnotherRoom = function (client) {
        this.removeClient(client);
    };
    Room.prototype.clientDisconnected = function (client) {
        this.removeClient(client);
    };
    Room.prototype.removeClient = function (client) {
        client.off('vote', this.boundClientVoted);
        client.off('disconnected', this.boundClientDisconnected);
        delete this.clientMap[client.id];
        // no more clients emit empty
        if (Object.keys(this.clientMap).length === 0) {
            this.emit('empty');
        }
        console.info("Client ".concat(client, " Left room ").concat(this.code));
    };
    Room.prototype.clientVoted = function (client, _a) {
        var vote = _a.vote;
        this.voteMap[client.id] = vote === null ? null : Number(vote);
        this.sendVotes();
    };
    Room.prototype.sendVotes = function () {
        this.sendAll('clientUpdate', JSON.stringify(this.clientData()));
    };
    Room.prototype.sendAll = function (event, message) {
        for (var clientId in this.clientMap) {
            var client = this.clientMap[clientId];
            client.send("".concat(event, "::").concat(message));
        }
    };
    return Room;
}(eventemitter2_1["default"]));
var ClientService = /** @class */ (function () {
    function ClientService() {
        this.clientMap = {};
        this.roomMap = {};
    }
    ClientService.prototype.registerClient = function (socket) {
        var _this = this;
        var client = new Client(socket);
        this.clientMap[client.id] = client;
        client.once('joinRoom', function (client, _a) {
            var roomCode = _a.roomCode, name = _a.name;
            var room = _this.findOrCreateRoom(roomCode);
            client.name = name;
            room.addClient(client);
        });
    };
    ClientService.prototype.findOrCreateRoom = function (code) {
        var _this = this;
        if (this.roomMap[code])
            return this.roomMap[code];
        var room = new Room(code);
        room.once('empty', function () {
            delete _this.roomMap[room.code];
        });
        this.roomMap[code] = room;
        return room;
    };
    return ClientService;
}());
exports.ClientService = ClientService;
