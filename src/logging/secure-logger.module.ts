import { DynamicModule, InjectionToken, Module, Provider } from '@nestjs/common';
import { SecureLogger } from '#app/logging/secure-logger.service';
import { SECURE_LOGGER_OPTIONS } from '#app/logging/secure-logger.tokens';
import { type SecureLoggerOptions } from '#app/logging/secure-logger.types';

@Module({})
export class SecureLoggerModule {
  static forRoot(options: SecureLoggerOptions = {}): DynamicModule {
    return {
      module: SecureLoggerModule,
      providers: [
        { provide: SECURE_LOGGER_OPTIONS, useValue: options },
        SecureLogger,
      ],
      exports: [SecureLogger],
    };
  }

  static forRootAsync<TDeps extends readonly InjectionToken[]>(factory: {
    useFactory: (...args: { [K in keyof TDeps]: unknown }) => Promise<SecureLoggerOptions> | SecureLoggerOptions;
    inject?: TDeps;
  }): DynamicModule {
    const asyncProvider: Provider = {
      provide: SECURE_LOGGER_OPTIONS,
      useFactory: factory.useFactory,
      inject: (factory.inject ?? []) as InjectionToken[],
    };

    return {
      module: SecureLoggerModule,
      providers: [asyncProvider, SecureLogger],
      exports: [SecureLogger],
    };
  }
}
