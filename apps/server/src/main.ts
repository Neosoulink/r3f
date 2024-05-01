import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WebsocketAdapter } from './adapters/websocket-adapter/websocket-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const webUrlOrigin = configService.get('WEB_URL');

  app.enableCors({
    origin: webUrlOrigin,
  });
  app.useWebSocketAdapter(new WebsocketAdapter(app, { origin: webUrlOrigin }));

  await app.listen(4000);
}
bootstrap();
