import { Inject, Injectable, LoggerService, Optional } from '@nestjs/common';
import pino, { Logger as PinoLogger } from 'pino';
import { scrubAny } from '#app/logging/secret-detector';
import { SECURE_LOGGER_OPTIONS } from '#app/logging/secure-logger.tokens';
import { type SecureLoggerOptions } from '#app/logging/secure-logger.types';
import { Loggable } from '#app/logging/secure-logger.types';
import { getPinoRedactPaths } from '#app/logging/getPinoRedactPaths';

@Injectable()
export class SecureLogger implements LoggerService {
  private readonly pino: PinoLogger;
  private redactPaths: string[];

  constructor(
    @Optional() @Inject(SECURE_LOGGER_OPTIONS) opts?: SecureLoggerOptions,
  ) {
    const level = opts?.level ?? process.env['LOG_LEVEL'] ?? 'info';

    this.redactPaths = (opts?.redact?.paths?.length ? opts.redact.paths : []).slice();

    if (opts?.redact?.addDefaultPaths ?? true) {
      this.redactPaths = [...this.redactPaths, ...getPinoRedactPaths()];
    }

    const redactPaths = getPinoRedactPaths();

    this.pino = pino({
      level,
      redact: {
        paths: redactPaths,
        censor: opts?.redact?.censor ?? '[REDACTED]',
      },
      hooks: {
        // Scrub *every* log call argument: strings and objects
        logMethod(args, method) {
          const safeArgs = args.map((a) => scrubAny(a)) as [string];
          method.apply(this, safeArgs);
        },
      },
    });
  }

  log(message: Loggable, ...optionalParams: string[]) { this.pino.info(message, ...optionalParams); }
  error(message: Loggable, ...optionalParams: string[]) { this.pino.error(message, ...optionalParams); }
  warn(message: Loggable, ...optionalParams: string[]) { this.pino.warn(message, ...optionalParams); }
  debug(message: Loggable, ...optionalParams: string[]) { this.pino.debug(message, ...optionalParams); }
  verbose(message: Loggable, ...optionalParams: string[]) {
    if (this.pino.trace) {
      this.pino.trace(message, ...optionalParams);
    } else {
      this.pino.debug(message, ...optionalParams);
    }
  }
}
