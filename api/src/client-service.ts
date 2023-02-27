import EventEmitter from 'eventemitter2';
import { WebSocket, RawData } from 'ws';
import { v4 as uuid } from 'uuid';

class Client extends EventEmitter {
  id: string;
  name = '';
  ws: WebSocket;
  heartbeatInterval: NodeJS.Timeout | null = null;
  isAlive = true;

  constructor(socket: WebSocket) {
    super();
    this.id = uuid();
    this.ws = socket;

    this.init();
    console.info(`New client ${this.id}`);
  }

  public toString() {
    return this.name || this.id;
  }

  public send(message: string) {
    this.ws.send(message);
  }

  private init() {
    // Respond to pings from client
    this.ws.on('ping', () => {
      this.ws.pong();
    });

    this.ws.on('pong', () => {
      this.isAlive = true;
    });

    this.ws.on('close', () => {
      this.connectionClosed();
    });

    this.ws.on('error', (error) => {
      console.log(error);
    });

    this.ws.on('message', (data) => {
      this.handleMessage(data);
    });

    // Ping the client on interval
    this.heartbeatInterval = setInterval(this.heartbeat.bind(this), 20000);
  }

  private heartbeat() {
    // if we havn't received a pong since last heartbeat, consider connection lost
    if (this.isAlive === false) {
      this.ws.terminate();
      this.connectionClosed();
    }

    this.isAlive = false;
    this.ws.ping();
  }

  private connectionClosed() {
    this.isAlive = false;
    this.ws.terminate();
    this.emit('disconnected', this);
  }

  private handleMessage(message: RawData) {
    // TODO: These messages should be changed to just be entirely JSON
    const [action, data] = message.toString().split('::');

    if (action && data) {
      try {
        console.log('emitting message', { action, data });
        this.emit(action, this, JSON.parse(data));
      } catch (error) {
        if (error instanceof SyntaxError) {
          console.error(`Invalid json in incoming message ${message}`);
        }
      }
    } else {
      console.error(`Malformed incoming message ${message}`);
    }
  }
}

class Room extends EventEmitter {
  code: string;
  clientMap: Record<string, Client> = {};
  voteMap: Record<string, number | null> = {};
  hideVotes = true;
  boundClientVoted: (client: Client, paylod: { vote: number }) => void;
  boundClientDisconnected: (client: Client) => void;
  boundClientJoinedAnotherRoom: (client: Client) => void;
  boundClearVotes: () => void;
  boundSetHideVotes: () => void;

  constructor(code: string) {
    super();
    this.code = code;
    this.boundClientVoted = this.clientVoted.bind(this);
    this.boundClientDisconnected = this.clientDisconnected.bind(this);
    this.boundClientJoinedAnotherRoom = this.clientJoinedAnotherRoom.bind(this);
    this.boundClearVotes = this.clearVotes.bind(this);
    this.boundSetHideVotes = this.setHideVotes.bind(this);
    console.info(`New Room ${this.code}`);
  }

  public addClient(client: Client) {
    this.clientMap[client.id] = client;

    client.on('vote', this.boundClientVoted);
    client.on('clearVotes', this.boundClearVotes);
    client.on('setHideVotes', this.boundSetHideVotes);

    client.once('disconnected', this.boundClientDisconnected);

    this.sendAll('clientUpdate', JSON.stringify(this.clientData()));

    console.info(`Client: ${client} Joined room: ${this.code}`);
  }

  private setHideVotes() {
    this.hideVotes = !this.hideVotes;

    this.sendAll('setHideVotes', JSON.stringify({ hideVotes: this.hideVotes }));
  }

  private clearVotes() {
    this.voteMap = {};
    this.sendVotes();
    this.sendAll('clearVote', '{}');
  }

  private clientData() {
    const result = [];

    for (const clientId in this.clientMap) {
      const client = this.clientMap[clientId];

      const vote = this.voteMap[clientId];
      result.push({
        name: client.name,
        id: client.id,
        currentVote: vote,
      });
    }

    return result;
  }

  private clientJoinedAnotherRoom(client: Client) {
    this.removeClient(client);
  }

  private clientDisconnected(client: Client) {
    this.removeClient(client);
  }

  public removeClient(client: Client) {
    client.off('vote', this.boundClientVoted);
    client.off('disconnected', this.boundClientDisconnected);

    delete this.clientMap[client.id];

    // no more clients emit empty
    if (Object.keys(this.clientMap).length === 0) {
      this.emit('empty');
    } else {
      // if there are clients send fresh room data
      this.sendVotes();
    }

    console.info(`Client ${client} Left room ${this.code}`);
  }

  private clientVoted(
    client: Client,
    { vote }: { vote: number | string | null }
  ) {
    this.voteMap[client.id] = vote === null ? null : Number(vote);

    this.sendVotes();
  }

  private sendVotes() {
    this.sendAll('clientUpdate', JSON.stringify(this.clientData()));
  }

  private sendAll(event: string, message: string) {
    for (const clientId in this.clientMap) {
      const client = this.clientMap[clientId];

      client.send(`${event}::${message}`);
    }
  }
}

export class ClientService {
  private clientMap: Record<string, Client> = {};
  private roomMap: Record<string, Room> = {};

  public registerClient(socket: WebSocket) {
    const client = new Client(socket);

    this.clientMap[client.id] = client;

    client.once(
      'joinRoom',
      (
        client: Client,
        { roomCode, name }: { name: string; roomCode: string }
      ) => {
        const room = this.findOrCreateRoom(roomCode);
        client.name = name;
        room.addClient(client);
      }
    );
  }

  public findOrCreateRoom(code: string) {
    if (this.roomMap[code]) return this.roomMap[code];

    const room = new Room(code);

    room.once('empty', () => {
      delete this.roomMap[room.code];
    });

    this.roomMap[code] = room;

    return room;
  }
}
