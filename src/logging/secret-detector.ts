import * as util from 'node:util';
import * as R from 'remeda';
import { Loggable } from '#app/logging/secure-logger.types';

const REPLACEMENT = '[REDACTED]';

// Fast regexes for common secret types (extend as needed)
const PATTERNS: RegExp[] = [
  /\b(?:AKIA|ASIA|AIDA|AGPA|ANPA|AROA|A3T[A-Z0-9])[A-Z0-9]{16}\b/g, // AWS Access Key ID
  /\bsk_(?:live|test)_[A-Za-z0-9]{16,}\b/g, // Stripe secret keys
  /\bgh[pousr]_[A-Za-z0-9]{30,}\b/g, // GitHub tokens
  /\bAIza[0-9A-Za-z\-_]{35}\b/g, // Google API key
  /\bxox[aboprs]-[A-Za-z0-9-]{10,}\b/g, // Slack tokens
  /\bBearer\s+[A-Za-z0-9._-]{20,}\b/gi, // Bearer tokens
  /\bBasic\s+[A-Za-z0-9+/=]{12,}\b/gi, // Basic auth blobs
  /\b(?:password|pass|secret|api[_-]?key|client[_-]?secret|refresh[_-]?token)\s*[:=]\s*\S+/gi, // generic k=v
  /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g, // JWT-like
  /-----BEGIN (?:RSA |EC |DSA )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |DSA )?PRIVATE KEY-----/g,
];

function maybeMaskBase64ish(s: string): string {
  // catch random long base64/urlsafe blobs that slip through patterns
  return s.replace(/\b[A-Za-z0-9+/_-]{32,}\b/g, (m) => {
    // Avoid obviously safe numbers; very light heuristic
    if (/^[0-9]+$/.test(m) || m.length > 2000) return m;
    return REPLACEMENT;
  });
}

export function scrubString(input: string): string {
  let out = input;
  for (const rx of PATTERNS) {
    out = out.replace(rx, REPLACEMENT);
  }
  out = maybeMaskBase64ish(out);
  return out;
}

export function scrubAny(value: Loggable, seen = new WeakSet()): Loggable {
  if (typeof value === 'string') return scrubString(value);
  if (!value || typeof value !== 'object') return value;
  if (seen.has(value)) return value;
  seen.add(value);

  if (R.isArray(value)) return value.map((v) => scrubAny(v, seen));

  // plain object: scrub keys commonly used for secrets and recurse values
  const obj = value;
  const out: Record<string, Loggable> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (/(pass(word)?|token|secret|api[_-]?key|client[_-]?secret|authorization|cookie)/i.test(k)) {
      out[k] = REPLACEMENT;
    } else {
      out[k] = scrubAny(v as Loggable, seen);
    }
  }

  return out;
}

export function redactionSafe<T extends object>(obj: T): T {
  // Useful for inspectors (e.g., util.inspect)
  return new Proxy(obj, {
    get(target, prop, receiver) {
      if (prop === util.inspect.custom || prop === 'toJSON') {
        return () => REPLACEMENT;
      }
      return Reflect.get(target, prop, receiver);
    },
  });
}
