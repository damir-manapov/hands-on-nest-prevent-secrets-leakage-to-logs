
type LoggableBase = string | number | boolean | object | Error;

export type Loggable = LoggableBase | LoggableBase[];

export type RedactOptions = {
  paths: string[];            // pino fast-redact paths
  addDefaultPaths?: boolean;  // default: true
  censor?: string;            // default: "[REDACTED]"
};

export type SecureLoggerOptions = {
  level?: string;         // default: process.env.LOG_LEVEL ?? "info"
  redact?: RedactOptions; // default paths below
  detectors?: RegExp[];   // extend regex list used by scrubAny
  addDefaultDetectors?: boolean;  // default: true
};
