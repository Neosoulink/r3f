import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { CorsOptions } from 'cors';
import { ServerOptions, Server } from 'socket.io';

export class WebsocketAdapter extends IoAdapter {
  constructor(
    app: INestApplicationContext,
    private readonly _corsOptions: CorsOptions,
  ) {
    super(app);
  }

  create(port: number, options?: ServerOptions): Server {
    return super.create(port, { ...options, cors: this._corsOptions });
  }
}
