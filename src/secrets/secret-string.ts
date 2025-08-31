import * as util from 'node:util';

const REDACTED = '[SECRET]';

export class SecretString {
  private constructor(private readonly v: string) {}
  static from(v: string) { return new SecretString(v); }
  reveal() { return this.v; } // use only when calling SDKs/crypto
  toString() { return REDACTED; }
  toJSON() { return REDACTED; }
  [util.inspect.custom]() { return REDACTED; }
}
