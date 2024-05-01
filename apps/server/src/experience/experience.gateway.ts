import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

export interface RoomConnectionOfferBody {
  roomName: string;
  offer: RTCSessionDescriptionInit;
}

@WebSocketGateway()
export class ExperienceGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join_room')
  async joinRoom(
    @MessageBody() roomName: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const room = this.server.in(roomName);

    const roomSockets = await room.fetchSockets();
    const numberOfPeopleInRoom = roomSockets.length;

    if (numberOfPeopleInRoom > 1) return room.emit('too_many_players');

    room.emit('player_joined', {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      id: socket.id,
    });

    socket.join(roomName);
  }

  @SubscribeMessage('send_connection_offer')
  async sendConnectionOffer(
    @MessageBody() body: RoomConnectionOfferBody,
    @ConnectedSocket() socket: Socket,
  ) {
    this.server
      .in(body.roomName)
      .except(socket.id)
      .emit('send_connection_offer', {
        ...body,
      });
  }

  @SubscribeMessage('answer')
  async answer(
    @MessageBody()
    {
      answer,
      roomName,
    }: {
      answer: RTCSessionDescriptionInit;
      roomName: string;
    },
    @ConnectedSocket() socket: Socket,
  ) {
    this.server.in(roomName).except(socket.id).emit('answer', {
      answer,
      roomName,
    });
  }

  @SubscribeMessage('move')
  async move(
    @MessageBody()
    body: {
      position: { x: 0; y: 0; z: 0 };
      rotation: { x: 0; y: 0; z: 0 };
      actionName: string;
      roomName: string;
    },
    @ConnectedSocket() socket: Socket,
  ) {
    this.server
      .in(body.roomName)
      .except(socket.id)
      .emit('move', {
        id: socket.id,
        ...body,
      });
  }

  @SubscribeMessage('send_candidate')
  async sendCandidate(
    @MessageBody()
    {
      candidate,
      roomName,
    }: {
      candidate: unknown;
      roomName: string;
    },
    @ConnectedSocket() socket: Socket,
  ) {
    this.server.in(roomName).except(socket.id).emit('send_candidate', {
      candidate,
      roomName,
    });
  }
}
