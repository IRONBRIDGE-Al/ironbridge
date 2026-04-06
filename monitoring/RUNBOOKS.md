— IronBridge Monitoring & Incident Response

How to detect, diagnose, and resolve failures across all IronBridge platform integrations.
This file is read by the Monitoring Agent and human team members alike.

Last updated: 2026-04-06

---

## MONITORING PHILOSOPHY

IronBridge runs like a real business. Silence is not success. Every integration must be actively confirmed alive — not just assumed working.

Rule: If it can break, it is monitored. If it is not monitored, it does not exist.

Primary monitoring tool: Raindrop (Sentry for AI Agents)
Alerting: Raindrop -> Slack + Twilio SMS for critical issues
Issue tracking: Linear (auto-created on alert)
Communication to users: Customer.io (automated delay notifications)

---

## HEALTH CHECK MATRIX

| Integration | Check Method | Frequency | Alert Threshold | Owner Agent |
|---|---|---|---|---|
| Base RPC (Alchemy) | Ping latest block | Every 60s | >3 failures | Monitoring Agent |
| Bankr Token Deploy | Test transaction | Every 5min | Any failure | Monitoring Agent |
| Supabase | Query health endpoint | Every 60s | >2 failures | Monitoring Agent |
| Stripe Webhooks | Check event log | Every 5min | No events in 1hr during business hours | Finance Agent |
| Circle USDC | Balance check | Every 15min | Balance < $500 | Finance Agent |
| Telegram Bot | Send ping to test chat | Every 5min | No response | Monitoring Agent |
| Discord Bot | Check guild presence | Every 5min | Bot offline | Monitoring Agent |
| X (Twitter) API | Check rate limit status | Every 15min | Rate limited | Monitoring Agent |
| Farcaster | Check API status | Every 15min | Any failure | Monitoring Agent |
| Raindrop itself | External ping | Every 5min | No response | Human (fallback) |
| Customer.io | Check delivery rates | Hourly | <90% delivery | Support Agent |
| Intercom | Check bot response time | Every 15min | >30s response | Support Agent |
| Auth0 | Check login success rate | Every 15min | <95% success | Security Agent |
| Vault/Doppler | Secret health check | Hourly | Any secret rotation failure | Security Agent |
| Snyk | Check for new critical CVEs | Daily | Any critical CVE | Security Agent |
| Midjourney | Test image generation | Hourly | Any failure during active launches | Content Agent |
| Jasper | Test content generation | Hourly | Any failure during active launches | Content Agent |
| Dashboard (The Graph) | Query subgraph | Every 5min | >60s query time | Monitoring Agent |

---

## INCIDENT RUNBOOKS

### RB-001: Token Deployment Failure (Bankr)

SYMPTOMS: Launch status stuck at DEPLOYING after 10 minutes. Raindrop alert: "Bankr deploy timeout"

IMMEDIATE ACTIONS:
1. Check Bankr API status page
2. Check Base network congestion (Alchemy block explorer)
3. Check IronBridge wallet gas balance
4. If gas issue: Finance Agent tops up from Mercury account
5. If Bankr API down: Activate Optional Tab — send user manual launch guide via Customer.io
6. Create Linear issue: [P0] Bankr Deploy Failure - LAUNCH-{id}
7. Retry deploy after 15 minutes

RESOLUTION: Bankr confirms deploy -> Update Supabase status -> Resume pipeline from step 5

USER COMMUNICATION: "Your token deployment is taking slightly longer than expected. We're on it — no action needed from you. You'll receive a confirmation within 30 minutes."

---

### RB-002: Liquidity Pool Failure

SYMPTOMS: Token deployed but LP not created. Dashboard shows 0 liquidity.

IMMEDIATE ACTIONS:
1. Verify token contract address is correct in Supabase
2. Check 0x API status (swap routing)
3. Check $BNKR balance in LP provisioning wallet
4. If balance low: Finance Agent replenishes from treasury (Safe multi-sig if >$500)
5. Retry LP creation with correct token address
6. Monitor for 5 minutes — confirm LP shows on DEX

USER COMMUNICATION: "Your token is live! Liquidity is being finalized — your chart will show within 15 minutes."

---

### RB-003: Website Generation Failure (Manus/Replit)

SYMPTOMS: Launch pipeline step 7 fails. No website URL generated.

IMMEDIATE ACTIONS:
1. Check Manus API status
2. Check Replit deployment queue
3. If both down: Activate Optional Tab — deploy pre-built static template with token's name/ticker/backstory injected
4. Static template backup lives at: /platform-integrations/website/fallback-template/
5. Update Supabase with fallback URL
6. Continue pipeline — don't block on website

USER COMMUNICATION: "Your site is live with our standard template. We'll upgrade it to your custom design within 2 hours."

---

### RB-004: Discord Server Creation Failure

SYMPTOMS: Discord setup fails (Growth/Viral tier). Browser Use or Do Anything agent reports error.

IMMEDIATE ACTIONS:
1. Check if Discord API rate limits hit
2. Check if Do Anything agent identity was flagged
3. Wait 30 minutes and retry once
4. If second failure: Activate Optional Tab
5. Optional Tab: Send user to Discord invite link pre-created by IronBridge team (generic template server that user can fork/clone)
6. Include Discord setup tutorial in onboarding email

USER COMMUNICATION: "Discord server is ready for you! Follow this guide to set up your server in 2 minutes: [guide link]. Takes 2 minutes and we've done everything else for you."

---

### RB-005: Telegram Bot Configuration Failure

SYMPTOMS: Telegram bot not responding or not configured.

IMMEDIATE ACTIONS:
1. Check BotFather API status
2. Check if bot token is valid in Vault/Doppler
3. Verify bot was added to correct chat
4. Retry configuration
5. If fails: Activate Optional Tab — send user bot setup instructions with their pre-generated token

USER COMMUNICATION: "Your Telegram bot is almost ready! It just needs one quick setup step from you: [instructions with their specific bot token pre-filled]."

---

### RB-006: X (Twitter) Profile Setup Failure

SYMPTOMS: X template not applied. Auto price tweets not running.

IMMEDIATE ACTIONS:
1. Check X API v2 rate limits
2. Check if API credentials rotated in Vault
3. Check if account flagged for automated activity
4. If rate limited: Queue and retry in 1 hour
5. If flagged: Activate Optional Tab — send user manual X setup guide

USER COMMUNICATION: "Your X presence is ready to go! We've prepared everything — just follow these steps to activate it: [link]."

---

### RB-007: Farcaster Profile Creation Failure

SYMPTOMS: Farcaster profile not created (Growth/Viral tier).

IMMEDIATE ACTIONS:
1. Check Farcaster API status (Neynar/Warpcast)
2. Check if wallet has enough ETH for Farcaster registration fee
3. If fee issue: Finance Agent covers from treasury
4. Retry registration
5. If API down: Queue for retry in 2 hours

USER COMMUNICATION: "Farcaster profile is being set up — should be ready within 2 hours. Everything else in your package is already live!"

---

### RB-008: Dashboard Not Loading

SYMPTOMS: User reports dashboard shows no data. The Graph subgraph not returning data.

IMMEDIATE ACTIONS:
1. Check The Graph subgraph sync status
2. Check Alchemy node connection
3. Check Supabase dashboard table for this launch
4. If subgraph behind: Wait for sync (check block lag)
5. If Alchemy issue: Switch to backup RPC endpoint
6. If data missing in Supabase: Re-trigger dashboard population from on-chain data

USER COMMUNICATION: "Your dashboard is syncing live data — this typically takes 10-20 minutes after launch. Refresh in a few minutes and you'll see everything."

---

### RB-009: $BNKR Liquidity Boost Failure

SYMPTOMS: $BNKR boost not applied to Growth/Viral tier token.

IMMEDIATE ACTIONS:
1. Check Bankr $BNKR routing API
2. Check $BNKR balance in boost wallet
3. If balance low: URGENT — notify human team immediately (treasury decision)
4. If Bankr API issue: Queue boost for retry every 30 minutes for 4 hours
5. If still failing after 4 hours: Human team decision on alternative liquidity source

USER COMMUNICATION: "Your $BNKR liquidity boost is being processed — typically completes within 1 hour of launch. Your token is live and trading while this finalizes."

---

### RB-010: Content Pack Generation Failure (Jasper/Bannerbear/Midjourney)

SYMPTOMS: Content pack not delivered after launch completion.

IMMEDIATE ACTIONS:
1. Check which tool failed (Jasper, Bannerbear, or Midjourney)
2. Retry failed tool once
3. If Midjourney fails: Use Replicate as fallback for image generation
4. If Jasper fails: Use Claude directly for content generation
5. If Bannerbear fails: Use pre-made template set as fallback
6. Deliver available content and note what will follow

USER COMMUNICATION: "Your content pack is being finalized — you'll receive it via email within 2 hours of launch. All other package features are live now."

---

### RB-011: Payment Processing Failure (Stripe)

SYMPTOMS: User payment fails. Launch not initiated.

IMMEDIATE ACTIONS:
1. Check Stripe webhook logs
2. Check if card declined or 3DS required
3. If 3DS: Redirect user to complete authentication
4. If decline: Show user alternative payment method (USDC via Circle)
5. NEVER retry payment without user consent
6. Send payment failure email via Customer.io with retry link

USER COMMUNICATION: "There was a hiccup with your payment. Don't worry — your launch details are saved. Click here to retry: [link]. Need help? Reply to this email."

---

### RB-012: Auth0 Login Failure

SYMPTOMS: Users cannot access dashboard. Login success rate drops below 95%.

IMMEDIATE ACTIONS:
1. Check Auth0 service status
2. Check if rate limits hit (too many login attempts)
3. Check if JWT signing key rotated without update
4. If Auth0 down: Activate maintenance mode on dashboard with ETA
5. If rate limit: Implement exponential backoff
6. Alert human team if Auth0 down > 10 minutes

USER COMMUNICATION: "We're experiencing a brief login delay. Your token is still live and trading normally — just your dashboard access is paused. Check back in 15 minutes."

---

## ESCALATION MATRIX

| Severity | Definition | Response Time | Who is Notified |
|---|---|---|---|
| P0 — Critical | Platform down, launches failing, user money affected | Immediate | All agents + human team via Twilio SMS |
| P1 — High | Single integration down, affecting active launches | 15 minutes | Monitoring Agent + relevant specialist agent |
| P2 — Medium | Degraded performance, non-blocking failures | 1 hour | Monitoring Agent logs in Linear |
| P3 — Low | Minor issues, cosmetic problems, non-urgent | Next day | Linear issue created, reviewed in daily standup |

---

## DAILY HEALTH REPORT

Every day at 08:00 UTC, the Monitoring Agent generates and posts to Nebula:

- Total launches in last 24h
- Successful launches (%)
- Failed launches with runbook reference
- Integration health summary (all green/yellow/red)
- Active Linear issues by priority
- Revenue from Stripe + Circle in last 24h
- $BNKR boost inventory level
- Any approaching rate limits or balance thresholds

---

## OPTIONAL TAB INVENTORY

When automation fails, these are the manual paths available:

| Failed Step | Optional Tab Content | Where Delivered |
|---|---|---|
| Token Deploy | Manual Bankr launch guide + wallet setup | Customer.io email |
| LP Creation | Manual DEX LP setup guide for Base | Customer.io email |
| Website | Pre-built template with user's token info | Dashboard link |
| X Profile | Step-by-step X setup with pre-written bio/banner | Customer.io email |
| Telegram Bot | BotFather setup guide with their specific config | Customer.io email |
| Discord | Template Discord server clone link + setup guide | Customer.io email |
| Farcaster | Manual Warpcast registration guide | Customer.io email |
| Dashboard | Direct DEX chart links (DexScreener, GeckoTerminal) | Customer.io email |
| Content Pack | Download link to generic starter content pack | Customer.io email |
| $BNKR Boost | Manual guide for adding $BNKR to LP | Customer.io email |

---

Last updated: 2026-04-06 | IronBridge AI Team
