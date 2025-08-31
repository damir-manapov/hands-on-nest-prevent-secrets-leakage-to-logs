import 'reflect-metadata';
import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from '#app/app.service';
import { SecretString } from '#app/secrets/secret-string';
import util from 'util';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/demo')
  getDemo(@Query('token') token?: string) {
    const secret = token ? SecretString.from(token) : SecretString.from('sk_live_FAKE12345678901234567890');

    const obj = {
      message: 'Received request',
      req: {
        headers: {
          authorization: `Bearer ${token ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake.fake'}`,
          cookie: 'sessionId=abc; token=123',
        },
        body: { password: 'super-secret', apiKey: 'AIZAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
      },
      plain: 'Stripe key sk_live_1234567890ABCDEFGHIJKLMN',
      wrapped: secret.toString(),
    };

    // Intentionally log risky payloads — they will be scrubbed
    this.appService.logRisky(obj);

    // eslint-disable-next-line no-console
    console.log(util.inspect(obj));

    return { ok: true };
  }
}

// eslint-disable-next-line no-console
console.log(
  'paramtypes:',
  Reflect.getMetadata('design:paramtypes', AppController),
);
