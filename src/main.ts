import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '#app/app.module';
import { SecureLogger } from '#app/logging/secure-logger.service';
import { Loggable } from '#app/logging/secure-logger.types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const logger = new SecureLogger();
  app.useLogger(logger);

  // Optional: Hijack console.* so rogue logs also get scrubbed
  for (const m of ['log', 'error', 'warn', 'debug'] as const) {
    // eslint-disable-next-line no-console
    console[m] = (...args: Loggable[]) => logger[m](args);
  }

  const port = Number(process.env['PORT'] ?? 3001);
  await app.listen(port);
}

// eslint-disable-next-line no-console
bootstrap().catch(e => console.error(e));
