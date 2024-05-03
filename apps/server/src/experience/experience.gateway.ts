import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

export interface PlayerEntity {
  id: string;
  position: { x: number; y: number; z: number };
  rotation: { w: number; x: number; y: number; z: number };
  action?: string;
}

@WebSocketGateway()
export class ExperienceGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  /** Peer players info. */
  players: Record<string, PlayerEntity> = {};

  /** New player connected */
  handleConnection(player: Socket) {
    const newPlayer: PlayerEntity = {
      id: player.id,
      position: { x: 0, y: 0, z: 0 },
      rotation: { w: 0, x: 0, y: 0, z: 0 },
    };

    /** Send to the new player himself's info */
    this.server.to(player.id).emit('player_info', newPlayer);

    /** Send to the new player other players info */
    this.server.to(player.id).emit('players_info', this.players);

    /** Add the new player info into the peers list */
    this.players[player.id] = newPlayer;

    /** Send to other players the new player info */
    this.server.except(player.id).emit('player_joined', newPlayer);

    console.log(
      `New player joined.\nID: ${player.id}.\nTotal players: ${this.server.engine.clientsCount}`,
    );
  }

  /** Player disconnected */
  handleDisconnect(client: Socket) {
    if (this.players[client.id]) delete this.players[client.id];
    this.server.emit('player_left', client.id);

    console.log(
      `Player left.\nID: ${this.server.engine.clientsCount}\nTotal players: ${this.server.engine.clientsCount}`,
    );
  }

  /** Player moved */
  @SubscribeMessage('player_moved')
  async move(
    @MessageBody()
    playerBody: PlayerEntity,
    @ConnectedSocket() player: Socket,
  ) {
    if (!this.players[player.id])
      throw new WsException('Invalid Player Socket ID');

    this.players[player.id] = {
      ...this.players[player.id],
      ...playerBody,
    };

    this.server
      .except(player.id)
      .emit('player_updated', this.players[player.id]);
    this.server.except(player.id).emit('players_updated', this.players);
  }
}
