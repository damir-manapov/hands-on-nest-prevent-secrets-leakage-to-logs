import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger('AppService');

  logRisky(payload: Record<string, unknown>) {
    // All of these will be scrubbed by SecureLogger hooks
    this.logger.log('About to log payload with possible secrets');
    this.logger.error(payload);
    this.logger.warn({ note: 'warning', payload });
    // eslint-disable-next-line no-console
    console.log('Console path with token: sk_test_abcdefghabcdefghabcdefgh');
  }
}
