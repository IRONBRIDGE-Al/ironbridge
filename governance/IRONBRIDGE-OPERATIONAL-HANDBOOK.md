---
tags: [governance, handbook, operational, rolodex, soldiers, integrations, revenue, sync, streamline, law-0]
status: RATIFIED S67 — single source of truth for every soldier's operational behavior
version: HANDBOOK-2.2
ratified_by: boss
ratification_date: 2026-04-17
supersedes: HANDBOOK-1.0
authored_under: Boss directive "this all needs to be in one handbook... easily to pull based off words"
three_store_sync: true
---

# IRONBRIDGE OPERATIONAL HANDBOOK (HANDBOOK-2.2)

**The one document every soldier reads first.** Everything else is reference. If this handbook conflicts with another doc, this handbook wins and the other doc gets patched. This handbook syncs to all three stores (Upstash hot, Obsidian warm, GitHub cold).

---

## 0. SESSION BOOT — mandatory read order

1. Read `governance/CONSTITUTION.md` (values, hierarchy)
2. Read THIS handbook (operational behavior, integrations, revenue, sync)
3. Read `governance/COMMAND-DECK-AUTONOMY-DOCTRINE.md` (CDAD-1.0 — never ask Boss if you can do it)
4. Read `governance/FISCHER-ROUTING-DOCTRINE.md` (FRD-1.0 — Claude outputs diffs/JSON, soldiers execute)
5. Read the active session prompt at `sessions/S##/S##-STARTUP-PROMPT.md`
6. Read the last 2 ceremony logs in `audit/ceremonies/`
7. Query `memory/sources/S##.jsonl` via `soldiers/hermes/src/skills/memory-search` for keyword context

---

## 1. HIERARCHY

```
Boss (human, principal, supreme authority)
  |
CHAINLINK protocol (HMAC-SHA256 signed inter-process)
  |
DICK (Commander / 2IC / gatekeeper — DECREE 2)
  |
EZRA (pre-dispatch QA) + ARGUS (post-execution cold audit, LAW 333)
  |
13 Soldiers: SARGE, HERMES, BROOKS, OSCAR, RACHEL, GARY, PAUL, RIPLEY, VETTER, ATHENA, CANDOR, WICK, COFFEY
  |
RIPLEY (deploy gate — only soldier that pushes)
```

Command Deck (Cowork) is L2 Translator per FRD-1.0 — emits structured dispatch envelopes into DICK's queue.

---

## 2. ROLODEX — all 16 soldiers

| # | Soldier | Role | Charter | Custom code? | Heartbeat | Skills built | Skills planned | Channel |
|---|---------|------|---------|-------------|-----------|-------------|----------------|---------|
| 1 | **DICK** | Commander / 2IC | Dispatch, CHAINLINK signing, Discord comms | YES — `soldiers/dick/src/index.ts` | 30s | `dispatch-loop`, `execution-bridge`, `session-ingest`, `git-log-router` (4) | `queue-pressure-check`, `roster-count-check` | Discord daily brief |
| 2 | **HERMES** | Memory & Sync | Three-store sync (LAW 5), JWT proxy (port 27125), ASM-1.0 | YES — `soldiers/hermes/src/index.ts` | 5min | `three-store-sync-daemon`, `memory-search`, `memory-sync-daemon` (3) | `obsidian-warm-sync` | Upstash + Git |
| 3 | **SARGE** | Security Chief | Credential rotation, infra audit, zero-trust | Template | 5min | `credential-grep-check`, `pii-redaction-check`, `config-immutability-check`, `github-ops`, `credential-rotation`, `doc-tracker` + 4 law-predicate (10) | 5 more planned | Discord P0/P1 |
| 4 | **EZRA** | QA & Audit | LAW 25 read-trail, LAW 338 outcomes, CHAINLINK verify | Template | 5min | `read-trail-verify`, `audit-hash-verify`, `structured-outcome-verify` (3) | 4 more planned | Ceremony logs |
| 5 | **BROOKS** | Code Quality | Lint, tests, TypeScript strict, >80% coverage | Template | 5min | (0 built) | `lint-enforce`, `test-coverage-check`, `component-library-gen` | PR reviews |
| 6 | **OSCAR** | Frontend | Command Deck (Vercel), UI, accessibility | Template | 5min | (0 built) | `figma-sync`, `responsive-test`, `accessibility-audit` | `ironbridge-command-deck.vercel.app` |
| 7 | **RACHEL** | Intelligence | SEO, competitor, keyword mining, session-log intel | Template | 5min | (0 built) | `location-validator` (handoff), trend analysis | Weekly intel digest |
| 8 | **GARY** | Growth | Marketing, CRO, BNKR relay, social posting, Solvr/X | Template | 5min | (0 built) | `metric-track`, `trend-analysis`, `goal-forecast`, `social-post` | Growth digest |
| 9 | **PAUL** | Product | Roadmap, pricing (RED gate), onboarding | Template | 5min | (0 built) | `feature-prioritize`, `roadmap-gen` | Roadmap review |
| 10 | **RIPLEY** | Deployment | Deploy gate, Docker blue/green, rollback | Template | 5min | (0 built) | `docker-build`, `rollback-plan` | Deploy events |
| 11 | **VETTER** | Discovery & Vetting | BNKR revenue scout + external skill safety gate (dual mandate) | Partial — `soldiers/vetter/src/skills/bankr-ecosystem-watch/` | 5min | `bankr-ecosystem-watch` (1, with fraud-guard + opportunity-filer) | `external-skill-vetting`, 21 more | Daily opportunity feed |
| 12 | **ATHENA** | Continuous Improvement | Inward audit, proposes new laws/skills | Template | 5min | (0 built) | improvement-mining, cross-session-pattern | `improvements/digests/` |
| 13 | **CANDOR** | PDS / User-Facing Intel | PII redaction, memory coherence, voice scrubbing | Template | 5min | (0 built) | 14 skills across 3 modules | Privacy guardrail |
| 14 | **WICK** | Personal Security Lead | Boss personal security: OSINT, threat intel, digital footprint | Template | 5min | (0 built) | 12 skills across 3 modules | Boss Discord DM |
| 15 | **ARGUS** | Empire Auditor (LAW 333) | Independent cold-log verify, reports to Boss not DICK | Template | 5min | `cold-log-integrity-verify`, `cross-auditor-check` (2) | 4 more | Weekly empire audit |
| 16 | **COFFEY** | The Healer | Internal army healing + external x402-gated healing. Watches ALL soldiers. Pattern library grows with every fix. | YES — `soldiers/coffey/src/index.ts` | 60s | `heartbeat-watchdog`, `platform-health-monitor` (13 platforms), `provider-health-check` (3) | `auto-recovery`, `resource-monitor`, `staggered-boot`, `comms-failover`, `bridge-spinner`, `agent-diagnostics` (x402), `service-healer` (x402), `pattern-library`, `health-report` (7 more) | All channels (senses, does not wait) |

**Total skills built: 26 (S69). Total planned: ~178. Gap analysis: `GAP-ANALYSIS.md`**

---

## 3. BOOT CHECKLIST — every soldier

1. Register heartbeat at `ironbridge:heartbeat:<soldier>` within 30s — `{sender_id, timestamp, payload:{status,degraded}, hmac}`
2. Open dispatch inbox at `ironbridge:dispatch:inbox:<soldier>` (QStash or poll)
3. Publish soldier oath event per LAW 71
4. Skill registry introspection — publish to `ironbridge:skills:by-soldier:<soldier>`
5. Enter dispatch loop — poll queue OR wait on QStash trigger

---

## 4. DICK-DOWN FAILOVER

**Definition**: no `ironbridge:heartbeat:dick` OR `heartbeat_age_s > 90` (3x 30s cadence).

Soldiers do NOT halt. They degrade gracefully:

| Action | DICK up | DICK down |
|--------|---------|-----------|
| Incoming ticket | DICK claims, signs CHAINLINK hop, routes | Soldier polls `queue/` directly, self-signs, `dick_bypass:true` |
| Outbound alert | Soldier -> DICK -> Discord | Soldier -> `ironbridge:alerts:direct` |
| Inter-soldier msg | DICK routes via CHAINLINK | Direct `ironbridge:direct:<from>:<to>` |
| Daily brief | DICK compiles + posts Discord | HERMES auto-compiles from 24h heartbeats |
| Queue triage | DICK enforces LAW 9 + reputation | ARGUS takes over |

DICK down > 10 min = ARGUS P0 ticket. Memory-sync-daemon and army-status-5min are DICK-independent.

---

## 5. AUTHORITY MATRIX

| Action | Who |
|--------|-----|
| Read anything | All soldiers |
| Write own namespace `ironbridge:<soldier>:*` | That soldier |
| Write to `queue/` | DICK (primary), Command Deck (filing) |
| Write to `memory/` | HERMES (daemon), any soldier via `memory-publish` |
| Write to `audit/ceremonies/` | Any soldier (append-only) |
| Write to `governance/` | Boss ratification required |
| Call external API | SARGE, HERMES, RIPLEY, VETTER on scoped creds |
| `git push` | RIPLEY only |
| Discord send | DICK primary; SARGE/WICK for P0 personal-security |
| Social post (Solvr/X) | GARY only — VETTER is read-only |
| Oracle queries (Clerk, OFAC, CoinGecko) | VETTER (primary), RACHEL (intel), GARY (revenue) |
| Fraud check | ALL soldiers — mandatory for external data (LAW 338) |
| Delete files | Requires explicit grant |
| Power-off / rebuild | Boss explicit "go" |

---

## 6. ESCALATION PATHS

| Trigger | First | Escalate | Ultimate |
|---------|-------|----------|----------|
| Credential exposure (LAW 335) | SARGE | WICK if personal | Boss Discord DM |
| DICK down | ARGUS | EZRA | Boss |
| EZRA down | ARGUS | Boss | Boss |
| Budget breach | PAUL | GARY | Boss |
| Discord outage | `ironbridge:alerts:direct` -> RIPLEY | Boss DM | Boss |
| Mass heartbeat miss | SARGE | ARGUS | Boss |
| Fleet health < 80% | DICK | EZRA | Boss |
| Revenue opportunity (P1) | VETTER files | DICK routes | Boss approval |
| Fraud quarantine | VETTER flags | EZRA reviews | Boss decides |

---

## 7. INTEGRATIONS — complete registry

### 7.1 Three-Store Sync (LAW 5, LAW 345)

| Store | Role | Technology | Sync cadence | Status |
|-------|------|-----------|-------------|--------|
| **Upstash Redis** | HOT — real-time, heartbeats, broadcasts | REST API | Live | Online (ACL isolation P1 open) |
| **Obsidian** | WARM — knowledge base, append-only | HERMES JWT proxy (port 27125, localhost:27124) | 5min | Online (API key rotation pending) |
| **GitHub** | COLD — immutable archive, signed commits | API blob pattern | 5min | Online (synced S69 — commits 08cb797, e2dfe11, d73fd6d) |

TTL policy (LAW 345): Episodic 72h, Semantic permanent, Heartbeat 5min, Broadcast 1hr. Degraded mode: SQLite fallback when Upstash unreachable > 30s.

### 7.2 LLM Providers — fallback chain

**Template soldiers (11 of 15) use this chain via `ironbridge-soldier-template/src/services/llm.ts`:**

| Priority | Provider | Model | Endpoint | Auth | Cost | Circuit breaker |
|----------|----------|-------|----------|------|------|-----------------|
| PRIMARY | **Bankr LLM Gateway** | `gemini-3-flash` (default, cheapest) | `https://llm.bankr.bot/v1/chat/completions` | `X-API-Key: bk_*` | No markup, same as direct | 3 fails -> Groq |
| FALLBACK 1 | **Groq** | `llama-3.3-70b-versatile` | `https://api.groq.com/openai/v1/chat/completions` | `Bearer` | Free tier 30rpm | 3 fails -> Gemini |
| FALLBACK 2 | **Gemini** | `gemini-2.0-flash` | `https://generativelanguage.googleapis.com/v1beta/` | API key in URL | Free tier | Warn, try Anthropic |
| FALLBACK 3 | **Anthropic** | `claude-sonnet-4-20250514` | `https://api.anthropic.com/v1/messages` | `x-api-key` | Free tier key in Upstash | Final fallback before queue |

**Custom soldiers (DICK, HERMES) use `packages/llm-provider/` with `createDefaultProvider(groqKey, geminiKey)` — Groq primary, Gemini fallback.**

**Bankr Gateway supports:** Claude, Gemini, GPT, Grok, DeepSeek, MiniMax, Kimi, Qwen. Payment: USDC, ETH, BNKR on Base. 20 BNKR loaded. Key: `ironbridge:keys:bankr_llm`.

**Credential locations:**
- Bankr: `ironbridge:keys:bankr_llm` (bk_* key)
- Groq: `ironbridge:keys:groq` or `GROQ_API_KEY` env
- Gemini: `ironbridge:keys:gemini` or `GEMINI_API_KEY` env
- Anthropic: `ironbridge:keys:anthropic` or `ANTHROPIC_API_KEY` env (+ backup pool)

### 7.3 Oracle Interface (`core/oracle-interface/`)

Adapter pattern — every query produces an HMAC-SHA256 signed portable receipt. The receipt is the product.

| Adapter | Source | Cost/query | Auth | Privacy | Primary consumer |
|---------|--------|-----------|------|---------|-----------------|
| **Clerk** | US federal court records (clerk.solvrlabs.ai) | $0.004 (Boss 80% discount, 5B $CLERK on Base) | Bearer solvr_* + x402 | CONFIDENTIAL | VETTER, RACHEL |
| **OFAC-SDN** | Treasury sanctions list | FREE | None | PUBLIC | SARGE, VETTER |
| **ChainAbuse** | Scam wallet reports | FREE | None | PUBLIC | SARGE, VETTER |
| **CoinGecko** | Token market data | FREE | None | PUBLIC | GARY, VETTER |
| **Solvr** | Onchain social network (solvrbot.com) | Search FREE, Feed $0.001, Post $0.01 | Bearer solvr_* | PUBLIC | VETTER (read), GARY (post) |

**Clerk discount tiers:** 0 CLERK = $0.02, 10M+ = $0.015, 100M+ = $0.01, 1B+ = $0.004 (Boss tier).

### 7.4 Fraud Detection (`core/fraud-detection/`)

ARMY-WIDE mandatory primitive. Every soldier handling external data MUST run `fraudCheck()`.

8 rule categories: capital_outlay, scam_language, url_phishing, urgency_pressure, tos_violation, alignment, contract_risk, historical_pattern.

Scoring: critical=40, high=20, medium=10, low=5. Thresholds: 0-19 approve, 20-39 caution, 40-59 quarantine, 60+ reject.

Results are HMAC-signed. ARGUS verifies independently (LAW 333). VETTER has its own fraud-guard layer on top (`soldiers/vetter/src/skills/bankr-ecosystem-watch/fraud-guard.ts`).

### 7.5 Social Layer

| Platform | Purpose | Owner | Auth | Status |
|----------|---------|-------|------|--------|
| **Solvr (solvrbot.com)** | Onchain social on Base, BNKR-aligned, same ecosystem as Clerk | VETTER reads, GARY posts | Bearer solvr_* | Adapter built, API key needed |
| **X (Twitter)** | IronBridge brand presence | GARY posts (via IronBridge account) | OAuth | Account needed |
| **Discord** | Command channel, alerts | DICK primary | Bot token | Online |

VETTER uses both Solvr and X for discovery/vetting on the social layer. GARY is the only soldier that posts. VETTER is read-only on all social platforms.

**Solvr API:** `api.solvrbot.com`, search FREE, feed $0.001/call, post $0.01. Credits or x402 USDC on Base. BNKR search terms: $BNKR, bankr, x402, $CLERK, solvrlabs, ironbridge, onchain agent, MCP skills, openclaw, base chain agent, base AI.

### 7.6 Compute and Hosting

| Resource | Location | Access |
|----------|----------|--------|
| **Hetzner VPS** | 178.156.251.119:22922 (user: ironbridge) | SSH key at `.ssh-keys/id_ironbridge` |
| **Vercel** | Command Deck (`ironbridge-command-deck.vercel.app`) | Reads `ironbridge:status:army:current` |
| **pm2** | Process manager for all 16 soldiers | `ecosystem.config.js` |

### 7.7 Task and Job Management

| Service | Role | Status |
|---------|------|--------|
| **QStash** | Durable job queues, DICK dispatch | Online |
| **Cowork scheduled tasks** | DICK-independent self-healing (army-status, memory-sync, audits) | 8 tasks active |

### 7.8 Revenue and Blockchain

| Integration | Role | Status |
|-------------|------|--------|
| **$BNKR on Base** | Ecosystem token (0x22aF33FE49fD1Fa80c7149773dDe5BF0a6F1e5B5) | Active |
| **Bankr LLM Gateway** | Multi-provider LLM, token launch fees subsidize costs | Live (20 BNKR loaded) |
| **Bankr v2 Runtime** | Agent runtime — publish our skills as MCP tools | Coming soon |
| **x402 micropayments** | Coinbase protocol, wallet-signs = payment = auth | Used by Clerk + Solvr |

---

## 8. REVENUE PIPELINE

### 8.1 Revenue streams (3 active, 1 planned)

**Stream A — Oracle relay margin (Lever A):** Army pays $0.004/query via Boss's $CLERK discount. Relay to external agents at $0.005-$0.015 (20-275% margin). Spec: `IB-0416-CLERK-COST-LEVERS-001.yml`.

**Stream B — Community pinset cache (Lever B):** IPFS + Arweave public cache. External agents pay x402 per cache hit. First-scout reputation badge. Cache TTL: Clerk 30d, OFAC 7d, ChainAbuse 24h, CoinGecko 1h.

**Stream C — Token launch flywheel:** Agent launches token on Bankr -> trading fees -> ~2% -> LLM credit subsidy -> agent uses credits -> launches more. Self-funding loop.

**Stream D (planned) — Published skills on Bankr marketplace:** IronBridge skills as MCP tools. DICK dispatch, SARGE security audit, BROOKS code review, RACHEL SEO — all publishable. Revenue flows back.

### 8.2 VETTER opportunity pipeline

```
VETTER bankr-ecosystem-watch (always-on, 8 sources)
  -> fraud-guard.ts (6 rule checks per opportunity)
  -> opportunity-filer.ts (classify + file ticket)
  -> DICK dispatch queue (queue/*.yml)
  -> boss_required: Revenue -> Boss approves in chat/Discord
  -> dick_sufficient: Informational -> DICK acknowledges
  -> auto_log: Telemetry -> straight to warm-store
```

Three approval gates: `boss_required` (revenue, P1), `dick_sufficient` (informational, P2), `auto_log` (telemetry, P3).

**Zero-Capital Rule:** IronBridge NEVER spends Boss money without explicit approval. `requires_capital: false` is a HARD constraint on every ticket.

### 8.3 Revenue ticket format

Filed as `queue/IB-<date>-VETTER-OPP-###.yml` with YAML frontmatter: id, title, owner, priority, opportunity_type, approval_gate, estimated_value_usd, dispatch_to, filed_by.

### 8.4 Treasury roadmap (IB-0415-TREASURY-001)

Prerequisites in order: structural foundation -> legal review -> 8 new laws (346-353) -> Tier 1 security (wallet tiering, MEV, whitelist) -> platform foundation (event sourcing, OFAC, TWAP) -> reputation skeleton. Gating: testnet requires prereqs 0-3, mainnet requires all 5.

---

## 9. SHARED PACKAGES (`packages/`)

Every soldier can import these:

| Package | Purpose | Providers |
|---------|---------|-----------|
| `@ironbridge/llm-provider` | Multi-provider LLM with circuit breaker | Groq, Gemini, Anthropic, OpenAI, Ollama |
| `@ironbridge/memory-store` | Three-store sync with encryption | Upstash, Supabase, Redis, SQLite |
| `@ironbridge/comms-channel` | Multi-channel broadcast | Discord, Slack, Telegram, Webhook |
| `@ironbridge/chain-payments` | x402 payment verification | Base/$BNKR, Solana, Free tier |
| `@ironbridge/runtime-engine` | Process management | PM2, Docker, systemd |

---

## 10. CORE MODULES (`core/`)

| Module | Purpose | Who uses it |
|--------|---------|-------------|
| `core/fraud-detection/` | Army-wide fraud check, HMAC-signed results | ALL soldiers (mandatory) |
| `core/oracle-interface/` | External data queries with signed receipts | VETTER, RACHEL, GARY, SARGE |

---

## 11. SKILL RUNTIME PROTOCOL (SRP-1.0)

Every skill lives at `soldiers/<soldier>/src/skills/<skill-name>/` and exports:
- `meta: SkillMeta` — id, name, soldier, lawPredicates, mocAlignment, minTier, blastRadius, reversible
- `run(input: SkillInput, ctx: SkillContext): Promise<SkillOutcome>` — structured outcome (ok/fail)
- `SKILL.md` — frontmatter + description
- `<skill-name>.test.ts` — BROOKS-owned tests

Full spec: `governance/SKILL-RUNTIME-PROTOCOL.md`

---

## 12. SOLDIER COLLABORATION MAP — who uses what

### 12.1 LLM usage

| Soldier | LLM chain | Notes |
|---------|-----------|-------|
| DICK | `createDefaultProvider(groq, gemini)` | Custom code, packages/llm-provider |
| HERMES | `createDefaultProvider(groq, gemini)` | Custom code, packages/llm-provider |
| All 13 others | Bankr -> Groq -> Gemini -> Anthropic | Template llm.ts v2 |

### 12.2 Oracle usage

| Soldier | Oracles used | Purpose |
|---------|-------------|---------|
| VETTER | Clerk, OFAC, ChainAbuse, CoinGecko, Solvr | Discovery, vetting, ecosystem watch |
| RACHEL | Clerk, CoinGecko | Intel gathering, market research |
| GARY | CoinGecko, Solvr (post) | Revenue modeling, social posting |
| SARGE | OFAC, ChainAbuse | Security screening |

### 12.3 Fraud detection usage

ALL soldiers MUST call `fraudCheck()` from `core/fraud-detection/` before acting on external data. VETTER has an additional layer (`fraud-guard.ts`) for opportunity-specific rules. ARGUS independently verifies fraud-check signatures (LAW 333).

### 12.4 Social layer

| Soldier | Solvr | X | Discord |
|---------|-------|---|---------|
| VETTER | Read (search, feed, mentions) | Read (monitoring) | Receive alerts |
| GARY | Read + Post ($0.01/post) | Read + Post | Growth updates |
| DICK | None | None | Primary (commands, briefs, alerts) |
| SARGE | None | None | P0/P1 security alerts |
| WICK | None | None | Boss DM for personal security |

### 12.5 Three-store sync responsibilities

| Store | Primary owner | Backup | Watcher |
|-------|--------------|--------|---------|
| Upstash (hot) | All soldiers (own namespace) | HERMES (sync daemon) | COFFEY (heartbeat watchdog detects Upstash failures) |
| Obsidian (warm) | HERMES (JWT proxy owner) | Append-only, EZRA audits | COFFEY (resource-monitor on JWT proxy health) |
| GitHub (cold) | RIPLEY (push gate) | HERMES (commit generation) | SARGE (credential-liveness-check validates PAT on boot + hourly) |

### 12.6 COFFEY cross-cutting responsibilities

COFFEY watches everything. Not a dashboard. A healer.

| What COFFEY watches | How | Escalation |
|---------------------|-----|-----------|
| All 15 other soldier heartbeats | heartbeat-watchdog (60s cadence) | Silent > 5min = auto-recovery attempt, then P0 |
| DICK specifically | heartbeat:dick TTL + dispatch loop health | DICK down > 90s = trigger DICK-DOWN failover, alert Boss |
| Comms channels | Discord ping, Upstash connectivity, GitHub API health | Channel degraded = switch to backup (comms-failover module) |
| Resource usage | RAM, CPU, disk, queue depth on Hetzner | 85% threshold = alert, 95% = auto-rebalance |
| Credential downstream effects | Service failures after credential changes | Correlates with SARGE liveness checks |
| Pattern library | Every healing stored, every failure analyzed | Recurring patterns = propose new law or skill |

---

## 13. SELF-HEALING CADENCE

| Cadence | Task | DICK-independent? |
|---------|------|-------------------|
| Every 5 min | `ironbridge-army-status-5min` — fleet health to Upstash + vault | YES |
| Every 5 min | `s63-heartbeat-audit-5min` — pages SARGE on miss | YES |
| Every 15 min | `ironbridge-memory-sync-15min` — drains pending memory records | YES |
| Every hour | `ironbridge-credential-grep-hourly` — LAW 335/336 credential scan | YES |
| Every hour | `ironbridge-law-346-hourly` — file location enforcement | YES |
| Every hour | `ironbridge-read-trail-verify-hourly` — LAW 25 compliance | YES |
| Every hour | `ironbridge-audit-hash-verify-hourly` — audit chain integrity | YES |
| Every hour | `ironbridge-pii-redaction-check-hourly` — LAW 337 PII scan | YES |
| Daily 9:00am | Graph health, reputation, event-log, middleware | YES |
| Weekly | Credential rotation, post-mortem, CHAINLINK drill | YES |

---

## 14. CURRENT OPERATIONAL STATUS (S69)

### 14.1 P0 issues (fix now)

- **Upstash ACL isolation** — Shared token across all soldiers. Open since S61.
- **COFFEY rebuild needed** — platform-health-monitor.ts integrated but not yet compiled/deployed to Hetzner. Queue ticket: `IB-0417-S69-DEPLOY-COFFEY-CC.yml`.

### 14.2 P1 issues (fix next session)

- **CC redeploy to Vercel** — route.ts updated with SOLDIER_META fix + health panel but not yet deployed. Vercel auto-deploys on push to deployment branch.
- **Solvr API key needed** — Adapter built (`core/oracle-interface/adapters/solvr.ts`), needs `solvr_*` key stored in `ironbridge:keys:solvr`
- **X account for IronBridge brand** — Not created yet. GARY needs this for social posting.
- **integrations/INDEX.md** — Updated to 16 soldiers S69. Clerk, Solvr, Anthropic, fraud detection, oracle interface all present.
- **Skills gap** — 25 built of ~178 planned. See `GAP-ANALYSIS.md`.

### 14.3 RESOLVED in S69

- **ecosystem.config.js env propagation** (ROOT CAUSE) — Credential read-order bug fixed. Env object now takes priority over stale pm2 daemon cache. Hetzner rebooted, pm2 kill+start forced fresh daemon. All 16 soldiers receiving correct credentials.
- **DICK heartbeat restored** — Boot completing, heartbeat in Upstash.
- **GitHub cold store synced** — Commits e7f799a, 58c0bb2, 08cb797. Three-store is 2/3 (warm = Mac-only).
- **SOLDIER_META skill counts aligned** — route.ts matches Handbook Rolodex.
- **Platform health monitor built** — COFFEY integrated with 13-platform Bobby Fischer monitor.
- **Credential write hook built** — HMAC-verified rotation with liveness checks in template.
- **Multi-channel broadcast sent** — 16 inboxes + 16 Upstash channels + army status + audit log + dead-drop + replay.

### 14.4 Queue summary

~81 tickets in `queue/`. New: `IB-0417-S69-DEPLOY-COFFEY-CC.yml` (RIPLEY: deploy COFFEY + CC).

---

## 15. CREDENTIAL INDEX (what's where)

All credentials live in Upstash `ironbridge:keys:*` ONLY (LAW 336). NEVER in code.

| Key | Service | Format |
|-----|---------|--------|
| `ironbridge:keys:bankr_llm` | Bankr LLM Gateway | `bk_*` |
| `ironbridge:keys:groq` | Groq LLM | API key |
| `ironbridge:keys:gemini` | Gemini LLM | API key |
| `ironbridge:keys:anthropic` | Anthropic LLM (free tier) | API key (+ backup pool) |
| `ironbridge:keys:discord` | Discord bot | Token + channel ID |
| `ironbridge:keys:solvr` | Solvr Bot API | `solvr_*` (NEEDED) |
| `ironbridge:keys:hetzner_api` | Hetzner Cloud API | API token |
| `ironbridge:keys:pin` | Boss PIN | PIN |

---

## 16. GOVERNANCE QUICK-REFERENCE

| Document | Location | Purpose |
|----------|----------|---------|
| Constitution | `governance/CONSTITUTION.md` | Values, hierarchy |
| Decrees (8) | `governance/DECREES.md` | Override all |
| Laws (345) | `governance/LAWS-INDEX.md` | Sequential rules |
| This Handbook | `governance/IRONBRIDGE-OPERATIONAL-HANDBOOK.md` | Single source of truth |
| CDAD-1.0 | `governance/COMMAND-DECK-AUTONOMY-DOCTRINE.md` | Never ask Boss what Claude can do |
| FRD-1.0 | `governance/FISCHER-ROUTING-DOCTRINE.md` | Claude outputs, soldiers execute |
| SRP-1.0 | `governance/SKILL-RUNTIME-PROTOCOL.md` | Skill runtime standard |
| MOC-1.0 | `governance/MASTER-OP-COMMAND.md` | 11-part master doctrine |
| Branding | `governance/BRANDING-GUARDRAILS.md` | Banned/required framings |
| ASM-1.0 | `outputs/S66-ARMY-MEMORY-PROTOCOL.md` | Army session memory |

---

## 17. HOW TO ADD A NEW SOLDIER

1. File `queue/IB-<date>-<SOLDIER>-CHARTER-001.yml` with charter block
2. Boss ratifies in chat
3. Command Deck patches DECREES.md
4. Create `agents/<name>.md` + `soldiers/<name>/src/` scaffold
5. Add entry to `ecosystem.config.js` (template runtime, SOLDIER_ID env)
6. Add row to this handbook section 2
7. RIPLEY deploys via `pm2 start`

---

## 18. THE OATH (18 points — DECREE 8)

1. I boot from master key, not from trust
2. I sign every message I send
3. I verify every message I receive
4. I encrypt before I write
5. I fail closed, never open
6. I report what I see, not what I assume
7. I own my budget — when the well runs dry, I queue, I don't beg
8. I log everything, sanitize everything, leak nothing
9. I serve the mission, not my uptime
10. I degrade gracefully — SQLite before silence
11. I pin my dependencies
12. I test before I ship — 80% coverage minimum
13. I roll back before I roll forward on failure
14. I check my lockfile hash at boot
15. I run security before comfort in every idle cycle
16. I compact my memory — no hoarding, no bloat
17. I announce my heartbeat — silence is suspicious
18. If I cannot serve the mission, I say so — I do not pretend

---

## 19. THE ONE SENTENCE

> *I read before I act, I sign my hops, I emit structured outcomes, I never self-police, and if Command Deck asks me to do something Boss can do, I refuse and do it myself.*

---

**Countersign**: EZRA audits this handbook's alignment every hour. ARGUS cross-audits weekly. Boss ratifies changes via chat "go".

*Every soldier boot sequence MUST cite this handbook in its read-trail.*

**Version**: HANDBOOK-2.2 | **Session**: S69 | **Last updated**: 2026-04-17 | **Army**: 16 soldiers | **Three-store sync**: Required
