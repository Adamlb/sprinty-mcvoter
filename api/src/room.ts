interface User {
  name: string;
  currentVote: number;
  connection: WebSocket;
}

class RoomMember {
  public name: string;
  public currentVote: number;
}

export class Room {
  private users: User[] = [];
  private roomCode: string;

  constructor(roomCode: string) {
    this.roomCode = roomCode;
  }

  public addUser(user: User) {
    if (this.users.find((u) => u.name === user.name)) {
      throw new Error('User already in room');
    }

    this.users.push(user);

    this.updateAll();
  }

  private updateAll() {
    for (const user of this.users) {
      user.connection.send(`updateRoom:${JSON.stringify(this.getData())}`);
    }
  }

  private getData() {
    const userData = [];
    for (const user of this.users) {
      userData.push({
        name: user.name,
        currentVote: user.currentVote,
      });
    }
    return {
      users: this.users,
      roomCode: this.roomCode,
    };
  }
}
