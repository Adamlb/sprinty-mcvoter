"use strict";
exports.__esModule = true;
var ws_1 = require("ws");
var config_1 = require("./config");
var client_service_1 = require("./client-service");
var wss = new ws_1.WebSocketServer({ port: config_1.config.websocketPort });
var clientService = new client_service_1.ClientService();
wss.on('connection', function connection(ws) {
    clientService.registerClient(ws);
    ws.on('error', console.error);
});
console.log("Websocket server listening on port ".concat(config_1.config.websocketPort));
