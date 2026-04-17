# S69 Ceremony Log: Ecosystem Config Env Propagation Fix

**Session**: S69
**Date**: 2026-04-17
**Soldier**: THANOS
**Read-trail**: ecosystem.config.js (Hetzner), /proc/{pid}/environ, pm2 logs
**SHA**: e7f799a98ae1fd228102ebc93443bbf09f73bf48

## Root Cause

pm2 daemon caches `process.env` at spawn time. The `loadEnvFile()` function in ecosystem.config.js has a guard: `if (!process.env[k] && v) process.env[k] = v` — which prevents `.env` file values from overriding already-set system environment variables.

The system had a stale `GITHUB_TOKEN` (old PAT) in the system environment. When `loadEnvFile` ran, it set `GITHUB_PAT` in the `env` object correctly, but the credential extraction lines read from `process.env` (which had the stale value or was missing `GITHUB_PAT` entirely).

Result: All 16 soldiers booted without `GITHUB_PAT`. DICK and HERMES reported "Cold store: DARK". DICK entered degraded mode on earlier boot when Upstash creds also had a mismatch (pre-reboot issue, resolved by reboot).

## Foxes Identified (Fischer Board Analysis)

1. **DICK WRONGPASS** — Stale Upstash creds in pm2 daemon cache (pre-reboot). Fixed by Hetzner Cloud API reboot.
2. **GITHUB_PAT missing** — ecosystem.config.js read from process.env instead of .env object. Fixed by changing credential reads to prefer env object.
3. **Zero missions dispatched** — Consequence of FOX 1+2: DICK couldn't read queues or dispatch.
4. **Queue full of heartbeat tickets** — Scheduled tasks generating infrastructure alerts, but no soldier processing them.
5. **Stale brief** — DICK couldn't write to Upstash, so brief stuck at S67.

## Fix Applied

Changed ecosystem.config.js lines 28-32:
```javascript
const U_URL = env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const U_TOK = env.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";
const G_PAT = env.GITHUB_PAT || env.IB_GH_TOKEN || process.env.GITHUB_PAT || process.env.IB_GH_TOKEN || "";
const D_TOK = env.DISCORD_TOKEN || process.env.DISCORD_TOKEN || "";
const Q_TOK = env.QSTASH_TOKEN || process.env.QSTASH_TOKEN || "";
```

Also added `GITHUB_PAT: G_PAT` and `IB_GH_TOKEN: G_PAT` to the BASE env block.

## Prevent Recurrence

1. Always read from `env` object first in ecosystem.config.js (env = loadEnvFile output)
2. After any `.env` file change on Hetzner: `pm2 kill && pm2 start ecosystem.config.js` (NOT just restart)
3. Never trust `pm2 restart --update-env` for NEW env vars — it only propagates vars already in the BASE object at daemon spawn time
4. Every session boot should verify GITHUB_PAT is in DICK's process env

## Verification

- HERMES cold store: OK (15:24:30 UTC)
- DICK GITHUB_PAT: confirmed in /proc/{pid}/environ after pm2 kill+start
- All 16/16 soldiers: ONLINE
- Commit synced to cold store: e7f799a
