# IronBridge Integrations Index

**Session:** S69 | **Soldiers:** 16 | **Integrations:** 20 active + 1 coming soon | **Last updated:** 2026-04-17

For full operational context, see `governance/IRONBRIDGE-OPERATIONAL-HANDBOOK.md` (HANDBOOK-2.2).

---

## Three-Store Sync (LAW 5, LAW 345)

| Store | Technology | Role | Cadence | Owner | Status |
|-------|-----------|------|---------|-------|--------|
| **Upstash Redis** | REST API | HOT — heartbeats, broadcasts, real-time | Live | All soldiers | Online (ACL isolation P1 open) |
| **Obsidian** | HERMES JWT proxy (port 27125) | WARM — knowledge base, append-only | 5min | HERMES | Online |
| **GitHub** | API blob pattern | COLD — immutable archive, signed commits | 5min | RIPLEY (push), HERMES (commit) | Online (last full sync stale) |

---

## LLM Providers

| Priority | Provider | Endpoint | Model | Auth | Used by |
|----------|----------|----------|-------|------|---------|
| PRIMARY | **Bankr LLM Gateway** | `https://llm.bankr.bot/v1/chat/completions` | `gemini-3-flash` (default) | `X-API-Key: bk_*` | 14 template soldiers |
| FALLBACK 1 | **Groq** | `https://api.groq.com/openai/v1/chat/completions` | `llama-3.3-70b-versatile` | Bearer | All (DICK/HERMES primary) |
| FALLBACK 2 | **Gemini** | `generativelanguage.googleapis.com` | `gemini-2.0-flash` | API key | All (DICK/HERMES fallback) |
| FALLBACK 3 | **Anthropic** | `https://api.anthropic.com/v1/messages` | `claude-sonnet-4-20250514` | `x-api-key` | 14 template soldiers |

**Bankr Gateway:** No markup, supports Claude/Gemini/GPT/Grok/DeepSeek/MiniMax/Kimi/Qwen. Payment: USDC, ETH, BNKR on Base. 20 BNKR loaded. Key: `ironbridge:keys:bankr_llm`.

**DICK + HERMES** use `packages/llm-provider/` with `createDefaultProvider(groqKey, geminiKey)` — Groq primary, Gemini fallback.

---

## Oracle Interface (`core/oracle-interface/`)

| Adapter | Source | Cost/query | Auth | Privacy | Consumers |
|---------|--------|-----------|------|---------|-----------|
| **Clerk** | US federal court records (clerk.solvrlabs.ai) | $0.004 (Boss 80% discount) | Bearer solvr_* + x402 | CONFIDENTIAL | VETTER, RACHEL |
| **OFAC-SDN** | Treasury sanctions list | FREE | None | PUBLIC | SARGE, VETTER |
| **ChainAbuse** | Scam wallet reports | FREE | None | PUBLIC | SARGE, VETTER |
| **CoinGecko** | Token market data | FREE | None | PUBLIC | GARY, VETTER |
| **Solvr** | Onchain social network (solvrbot.com) | Search FREE, Feed $0.001, Post $0.01 | Bearer solvr_* | PUBLIC | VETTER (read), GARY (post) |

Every query produces an HMAC-SHA256 signed portable receipt. The receipt is the product.

---

## Fraud Detection (`core/fraud-detection/`)

ARMY-WIDE mandatory. Every soldier handling external data MUST call `fraudCheck()`.

8 rules: capital_outlay, scam_language, url_phishing, urgency_pressure, tos_violation, alignment, contract_risk, historical_pattern. HMAC-signed results. ARGUS verifies (LAW 333).

---

## Social Layer

| Platform | Purpose | Owner | Auth | Status |
|----------|---------|-------|------|--------|
| **Solvr** (solvrbot.com) | Onchain social on Base, BNKR-aligned | VETTER reads, GARY posts | Bearer solvr_* | Adapter built, key needed |
| **X** (Twitter) | IronBridge brand presence | GARY posts | OAuth | Account needed |
| **Discord** | Command channel, alerts | DICK primary | Bot token | Online |

---

## Command & Control

| Service | Role | Status |
|---------|------|--------|
| **Discord** | Primary command channel (DECREE 338) | Online |
| **QStash** | Durable job queues, DICK dispatch | Online |
| **Cowork scheduled tasks** | DICK-independent self-healing (8 tasks) | Active |

---

## Compute & Hosting

| Resource | Location | Status |
|----------|----------|--------|
| **Hetzner VPS** | 178.156.251.119:22922 (user: ironbridge) | Online — 16 soldiers via pm2 |
| **Vercel** | `ironbridge-command-deck.vercel.app` | Online |

---

## Revenue & Blockchain

| Integration | Role | Status |
|-------------|------|--------|
| **$BNKR on Base** | Ecosystem token | Active |
| **Bankr LLM Gateway** | Multi-provider LLM, token launch fee subsidy | Live |
| **Bankr v2 Runtime** | Agent runtime — publish skills as MCP tools | Coming soon |
| **x402 micropayments** | Coinbase protocol (wallet-sign = payment = auth) | Used by Clerk + Solvr |
| **$CLERK on Base** | 5B tokens = 80% discount on court records | Boss wallet |

---

## Credential Locations (Upstash ONLY — LAW 336)

| Key | Service |
|-----|---------|
| `ironbridge:keys:bankr_llm` | Bankr Gateway (bk_*) |
| `ironbridge:keys:groq` | Groq LLM |
| `ironbridge:keys:gemini` | Gemini LLM |
| `ironbridge:keys:anthropic` | Anthropic LLM (free tier + backup pool) |
| `ironbridge:keys:discord` | Discord bot token + channel |
| `ironbridge:keys:solvr` | Solvr Bot API (NEEDED) |
| `ironbridge:keys:hetzner_api` | Hetzner Cloud |
| `ironbridge:keys:pin` | Boss PIN |

---

## Integration Health

| Integration | Status | Last verified |
|-------------|--------|--------------|
| Upstash Redis | Online | Live |
| Obsidian | Online | 5min sync |
| GitHub | Online (stale sync) | S36 last full |
| Discord | Online | Live |
| Hetzner | Online | Live |
| Vercel | Online | Live |
| Bankr LLM Gateway | Live | S62 deploy |
| Groq | Online | Live |
| Gemini | Online | Live |
| Anthropic | Online | S67 wired |
| QStash | Online | Live |
| Oracle Interface | Built | S67 |
| Fraud Detection | Built | S67 |
| Solvr Adapter | Built | S67 (key needed) |
| $BNKR | Active | Live |
| Bankr v2 Runtime | Coming Soon | Monitoring |

---

**Docs:** `bankr-llm-gateway.md`, `bankr-llm-gateway-docs.md`, `bankr-openclaw-docs.md`, `bankr-intel-gitlawb.md`
