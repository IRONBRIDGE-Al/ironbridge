# CLAUDE Vault Orientation

**Every Claude session reads this before writing anything to the vault.**

## You are in

IronBridge vault. Mac host path: `/Users/leaux/Ironbridge/`. Cowork VM mount varies per session — check `/sessions/<session-id>/mnt/Ironbridge`. Linux deploy path (server): `/home/ironbridge/soldiers/<repo>` (soldier code only, not the full vault).

## Governance order

Boss → CHAINLINK protocol → DICK (field commander) → EZRA (QA pre-dispatch) + ARGUS (independent post-audit, LAW 333) → SARGE / HERMES / BROOKS / OSCAR / RACHEL / GARY / PAUL / RIPLEY / VETTER / ATHENA / CANDOR / WICK (soldiers = 15 total).

## Session boot — MANDATORY read order (HANDBOOK-1.0 §0)

1. `governance/CONSTITUTION.md` — values, hierarchy
2. `governance/IRONBRIDGE-OPERATIONAL-HANDBOOK.md` — **SINGLE SOURCE OF TRUTH** for every soldier's operational behavior (rolodex, DICK-down failover, escalation paths, authority matrix)
3. `governance/COMMAND-DECK-AUTONOMY-DOCTRINE.md` (CDAD-1.0) — **"never ask Boss to do what Claude can do from this session"** — run the Pre-Ask Capability Check before every delegation
4. `governance/FISCHER-ROUTING-DOCTRINE.md` (FRD-1.0) — Claude outputs diffs/JSON, soldiers execute; never direct push/pay
5. The active session prompt at `sessions/S##/S##-STARTUP-PROMPT.md`
6. Last 2 ceremony logs in `audit/ceremonies/`
7. Query `memory/sources/S##.jsonl` via `soldiers/hermes/src/skills/memory-search` for any topic-relevant context

## Read before act (LAW 25)

Before any state-changing action, declare a read-trail: source, sha256, timestamp, soldier_id, purpose. Write the declaration into the ceremony log you are creating or into your tool-call messages. No exceptions.

## Where files go (LAW 346)

- Session-tagged files (`S##-*`) → `sessions/S##/`
- Session-tagged scripts → `sessions/S##/scripts/`
- Vault root is reserved for: `VAULT-INDEX.md`, `IRONBRIDGE-MANIFESTO.md`, the active `S##-STARTUP-PROMPT.md`, and `.claude/`.
- Everything else goes in its topical folder: `governance/`, `audit/`, `integrations/`, `skills/`, `agents/`, `queue/`, `reporting/`, `soldiers/`, `packages/`, etc.

## Key governance paths

| What | Where |
|---|---|
| **OPERATIONAL HANDBOOK (primary)** | `governance/IRONBRIDGE-OPERATIONAL-HANDBOOK.md` |
| Command Deck Autonomy Doctrine | `governance/COMMAND-DECK-AUTONOMY-DOCTRINE.md` |
| Fischer Routing Doctrine | `governance/FISCHER-ROUTING-DOCTRINE.md` |
| Laws | `governance/LAWS-INDEX.md` |
| Decrees (highest priority) | `governance/DECREES.md` |
| Constitution | `governance/CONSTITUTION.md` |
| Protocols (implementation) | `governance/PROTOCOLS-INDEX.md` |
| Branding guardrails (LAW 337 adjacent) | `governance/BRANDING-GUARDRAILS.md` |
| Army Session Memory (ASM-1.0) protocol | `outputs/S66-ARMY-MEMORY-PROTOCOL.md` |
| Skill Runtime (SRP-1.0) | `governance/SKILL-RUNTIME-PROTOCOL.md` |
| Master Operational Command (MOC-1.0) | `governance/MASTER-OP-COMMAND.md` |

## Key operational paths

| What | Where |
|---|---|
| Active tickets | `queue/` |
| Soldier code | `soldiers/<name>/` |
| Soldier docs | `agents/<name>.md` |
| Ceremony logs | `audit/ceremonies/` |
| Hourly checks output | `audit/queue-sanity/`, `audit/heartbeat-flaps/`, `audit/vault-sync-checks/`, `audit/law-346-checks/` |
| Open violations | `audit/violations/OPEN.md` |
| Credentials (Upstash-only per LAW 336) | NOT in this repo — see `private/CREDENTIAL-INDEX.md` for the index |

## Safety invariants

- No credentials in source, env files, ceremony logs, or git remote URLs (LAW 335/336).
- No `git push` without explicit Boss authorization in chat — always via RIPLEY.
- No "audit-as-a-service" or "regulatory cleanliness score" framings — see `governance/BRANDING-GUARDRAILS.md`.
- Every silent failure is a LAW 338 violation; surface reasons in a structured outcome.
- All log output sanitizes tokens via `sed -E 's#ghp_[A-Za-z0-9_]+#ghp_<REDACTED>#g; s#://[^@/]+:?[^@/]*@#://<REDACTED>@#'`. See CDAD-1.0 §4.1.

## Pre-Ask Capability Check (CDAD-1.0 §1 — MANDATORY before delegating anything to Boss)

Before asking Boss to do any manual step, Command Deck verifies in order:
1. Is the credential readable from a mounted folder (e.g. `command-deck/.env.local`)?
2. Is it fetchable from Upstash?
3. Does the Bash sandbox have network access to the target service?
4. Can Claude-in-Chrome drive the browser action in Boss's authenticated session?
5. Is there an MCP tool (`scheduled-tasks`, etc.) that performs this?

If ANY yes → execute silently. If ALL no → ask via `AskUserQuestion`.

## Always-automated actions (never ask Boss)

See CDAD-1.0 §2. Includes: Upstash reads/writes, Hetzner Cloud API calls, SSH key generation, scheduled task creation, file moves in the vault, ceremony log writes, queue ticket filing.

## Infrastructure quick-facts (CDAD-1.0 capability map)

| Resource | Location | Access from this session |
|---|---|---|
| Upstash REST creds | `command-deck/.env.local` | Direct read (mounted) |
| Hetzner API token | `ironbridge:keys:hetzner_api` (Upstash) | Via Upstash |
| Hetzner server IP | `private/CREDENTIAL-INDEX.md` (IP: `178.156.251.119`, SSH port `22922`, user `ironbridge`) | SSH from sandbox works |
| SSH private key (Mac-side) | `.ssh-keys/id_ironbridge` (vault-persistent) | Direct read |
| Vercel Command Deck | `command-deck/` (Next.js) — live at `ironbridge-command-deck.vercel.app` | Reads Upstash `ironbridge:status:army:current` for live fleet |
| Live army status | `sessions/current/LIVE-ARMY-STATUS.md` (updated by `ironbridge-army-status-5min` scheduled task) | Direct read |

## When in doubt

Read the active session's prompt at `sessions/S##/S##-STARTUP-PROMPT.md`. Read the two most recent ceremony logs. Run the Pre-Ask Capability Check. Only ask Boss via `AskUserQuestion` if CDAD-1.0 §3 applies (classic PAT revoke, OAuth consent, destructive ops, `git push`).
