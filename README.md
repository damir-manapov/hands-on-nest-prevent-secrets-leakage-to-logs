# Hands on nest prevent secrets leakage to logs

A minimal Nest app that prevents accidental secret leakage in logs.

## Run

```bash
yarn
yarn start:dev
# open http://localhost:3000/demo?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.abc.def
```

Inspect the terminal output: any secrets in strings, headers, or payloads should be replaced with `[REDACTED]`.

## Production Notes
- Keep JSON logs; avoid pretty transports in prod.
- Set `LOG_LEVEL=info` (or `warn`).
- Consider adding egress masking in your log pipeline (Vector / OTel / Datadog) as an extra safety net.

## Extending Secret Detection
- Add new regexes to `src/logging/secret-detector.ts`.
- Prefer **whitelisting** what you log (IDs, sizes) rather than logging whole payloads.

## Type-Safe Secrets
Wrap sensitive strings with `SecretString` so they won’t stringify in logs.