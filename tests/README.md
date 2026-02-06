# tests/

This folder holds lightweight project health checks and smoke tests.

- `check-keys.js` — a small node script that loads your local `.env` and performs non-destructive checks against configured API keys and service account JSON. It's intended for local development to quickly surface missing/invalid environment variables.

Run with:

```bash
# from project root
npm run check:keys
```

Notes:
- The script performs simple HTTP requests and does not modify remote resources.
- Do not commit secrets. Keep `.env` in `.gitignore`.
