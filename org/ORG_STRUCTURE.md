# ORG_STRUCTURE.md — IronBridge Organizational Structure

How the IRONBRIDGE-Al team is organized, how agents are assigned, and how the business runs without human bottlenecks.

Last updated: 2026-04-06

---

## MISSION

Build the best beginner-friendly token launch platform on Base, powered by $BNKR. Every user gets a complete, professional launch in under 10 minutes. We do the legwork. They get the result.

---

## OPERATING PHILOSOPHY

IronBridge runs as a zero-human-bottleneck organization. Every repeatable task has an agent. Every exception has a runbook. Every decision has a documented process. The team focuses exclusively on strategy, vision, and things that cannot be automated.

Core principles:
1. Automate first, hire never (for repeatable work)
2. Monitor everything — silence is not success
3. $BNKR alignment in every financial decision
4. Optional Tab over blocker — always give users a path forward
5. Beginners first — if a 14-year-old can't use it, it's not ready

---

## ORGANIZATIONAL LAYERS

IronBridge operates in 4 layers:

### Layer 1 — Strategy (Human)
The founding team. Sets vision, makes major product decisions, handles partnerships, fundraising, and anything requiring human judgment or legal authority.

Responsibilities:
- Product roadmap and prioritization
- Partnership and integration decisions
- Fundraising and investor relations
- Brand voice and community leadership
- $BNKR ecosystem alignment decisions
- Escalated user issues that agents cannot resolve

Tools: Notion (decision logs), Linear (roadmap), Safe (treasury co-signing)

---

### Layer 2 — Operations (Agent-Orchestrated)
Cofounder + Nebula + Perplexity Computer run the day-to-day business. Natural language commands trigger agent workflows. No human needs to touch operational tasks.

Agent Roles:

LAUNCH COORDINATOR AGENT
- Receives new IronForge submissions
- Orchestrates the full deployment pipeline
- Reports completion or failure to Raindrop
- Tools: Supabase, Bankr, Alchemy, Browser Use, Do Anything
- Skill alignment: Executing Plans, Verification Before Completion, Dispatching Parallel Agents

MONITORING AGENT
- 24/7 uptime checks on all platform integrations
- Fires Raindrop alerts on anomalies
- Creates Linear issues for failures
- Tools: Raindrop, Linear, Supabase
- Skill alignment: Azure Observability, AppInsights Instrumentation, Systematic Debugging

SUPPORT AGENT
- Handles all user inquiries via Intercom
- Reads Supabase for launch status to answer questions
- Escalates to human only when policy limits reached
- Tools: Intercom, Supabase, AgentMail
- Skill alignment: Webapp Testing, Verification Before Completion

CONTENT AGENT
- Generates content packs for all token launches
- Creates social posts, banners, website copy
- Triggered automatically on launch completion
- Tools: Jasper, Bannerbear, Midjourney, Customer.io
- Skill alignment: Social Content, Copywriting, Content Strategy

FINANCE AGENT
- Monitors Stripe and Circle revenue
- Reconciles in Digits
- Reports to team via Nebula
- Tools: Stripe, Circle, Mercury, Ramp, Digits
- Skill alignment: Analytics Tracking, Pricing Strategy

---

### Layer 3 — Platform (Automated Systems)
The actual IronForge launch pipeline. Fully automated. No human involvement in standard launches.

LAUNCH PIPELINE (in sequence):
1. User submits launch form (token name, ticker, backstory, image, wallet, package)
2. Stripe/Circle processes payment
3. Supabase records launch record with status: QUEUED
4. Launch Coordinator Agent picks up job
5. Bankr deploys ERC-20 token on Base
6. Liquidity pool provisioned via Bankr ($500/$2000/$5000 by tier)
7. Website generated (Manus/Replit)
8. X profile template created (Browser Use / Do Anything)
9. Telegram bot configured
10. Discord server created (Growth+)
11. Farcaster profile created (Growth+)
12. Dashboard activated (live chart, holder data via Alchemy/The Graph)
13. $BNKR liquidity boost routed (Growth+)
14. Content pack generated (Jasper, Bannerbear, Midjourney for Viral)
15. Customer.io sends launch confirmation + dashboard link
16. Supabase updates status: COMPLETE
17. Raindrop logs successful launch

FAILURE HANDLING:
- Any step failure triggers Raindrop alert
- Linear issue created automatically
- Monitoring Agent notified
- User receives "slight delay" email via Customer.io
- Optional Tab activated for failed step if manual path available
- Human escalation only if Optional Tab fails

---

### Layer 4 — Intelligence (Learning Systems)
Systems that make IronBridge smarter over time.

MEMORY LAYER: Supermemory + Hermes Agent
- Every launch stored in Supermemory
- Hermes Agent builds patterns: which tickers trend, which launch times succeed, which communities grow
- RAG over all launch history for agent context

ANALYTICS LAYER: Mixpanel + Segment + Dune Analytics
- User funnel tracked (Mixpanel)
- On-chain ecosystem health (Dune)
- Data routed to all tools via Segment

RESEARCH LAYER: Parallel
- Agents stay current on Base ecosystem news
- $BNKR price and volume monitoring
- Trending meme formats for content generation
- Competitor platform monitoring

---

## AGENT ROSTER

| Agent Name | Role | Primary Tools | Always On? |
|---|---|---|---|
| Launch Coordinator | Orchestrates token launches end-to-end | Bankr, Supabase, Browser Use, Alchemy | Yes |
| Monitoring Agent | Platform health 24/7 | Raindrop, Linear, Supabase | Yes |
| Support Agent | User support via Intercom | Intercom, Supabase, AgentMail | Yes |
| Content Agent | Generates content packs | Jasper, Bannerbear, Midjourney | On-demand |
| Finance Agent | Revenue monitoring and reconciliation | Stripe, Digits, Mercury, Circle | Yes |
| Research Agent | Market intelligence | Parallel, Dune Analytics | Daily |
| Security Agent | Codebase and secret monitoring | Snyk, Vault/Doppler, NemoClaw | Yes |
| Sales Agent | Lead gen and outreach | Apollo, Attio, Customer.io | Scheduled |

---

## SKILLS MAPPED TO ORG ROLES

### Launch Coordinator Agent Skills:
- Executing Plans (@obra) — multi-step launch workflows
- Dispatching Parallel Agents (@obra) — run platform setups in parallel
- Verification Before Completion (@obra) — verify each step before moving to next
- Agent Browser (@vercel-labs) — navigate and interact with platforms
- Browser Use (@browser-use) — complex multi-step platform setups
- Subagent Driven Development (@obra) — spawn subagents for each platform

### Monitoring Agent Skills:
- Azure Observability (@microsoft) — infrastructure monitoring
- AppInsights Instrumentation (@microsoft) — telemetry
- Azure Diagnostics (@microsoft) — issue diagnosis
- Systematic Debugging (@obra) — root cause analysis
- Webapp Testing (@anthropics) — functional testing
- Audit Website (@squirrelscan) — user site quality checks

### Support Agent Skills:
- Webapp Testing (@anthropics) — understand what users experience
- Verification Before Completion (@obra) — confirm issues are resolved
- Writing Skills (@obra) — clear, empathetic user communication
- Receiving Code Review (@obra) — incorporate feedback gracefully

### Content Agent Skills:
- Copywriting (@coreyhaines31) — compelling token launch copy
- Social Content (@coreyhaines31) — social media posts per platform
- Content Strategy (@coreyhaines31) — 7 and 30-day content packs
- Copy Editing (@coreyhaines31) — polish all output
- Algorithmic Art (@anthropics) — programmatic meme art generation
- Theme Factory (@anthropics) — custom website themes per token

### Finance Agent Skills:
- Analytics Tracking (@coreyhaines31) — revenue and spend tracking
- Pricing Strategy (@coreyhaines31) — package tier optimization
- Xlsx (@anthropics) — financial reports
- Pdf (@anthropics) — financial summaries

### Research Agent Skills:
- Find Skills (@vercel-labs) — discover new platform integrations
- Brainstorming (@obra) — new feature and package ideas
- Marketing Ideas (@coreyhaines31) — campaign generation
- Competitor Alternatives (@coreyhaines31) — competitive positioning

### Security Agent Skills:
- Azure Compliance (@microsoft) — compliance monitoring
- Azure RBAC (@microsoft) — access control
- Mcp Builder (@anthropics) — secure integration building
- Systematic Debugging (@obra) — security incident analysis

### Sales Agent Skills:
- Programmatic SEO (@coreyhaines31) — organic growth
- Page CRO (@coreyhaines31) — landing page optimization
- Form CRO (@coreyhaines31) — launch form conversion
- Onboarding CRO (@coreyhaines31) — beginner flow optimization
- Signup Flow CRO (@coreyhaines31) — reduce drop-off
- Paywall Upgrade CRO (@coreyhaines31) — Starter to Growth to Viral upgrades
- Email Sequence (@coreyhaines31) — nurture campaigns

---

## DECISION-MAKING FRAMEWORK

### Can an agent decide this alone?
- YES: Any action within defined policy (deploy token, send email, create content, post to social)
- NO: Any action touching treasury > $500, new platform integration, user refunds, legal matters

### Escalation Path:
Agent tries -> Agent fails -> Runbook consulted -> Optional Tab activated -> Human notified

### Communication Protocol:
- Agent-to-agent: Nebula channels
- Agent-to-human: Nebula + Linear issue
- Critical alerts: Raindrop -> Slack/SMS (Twilio)
- User communications: Customer.io + Intercom + AgentMail

---

## FINANCIAL STRUCTURE

### Revenue:
- Starter packages: $49 one-time (Stripe or USDC via Circle)
- Growth packages: $99 upfront + $19/month (Stripe subscription)
- Viral packages: $199 upfront + $39/month (Stripe subscription)

### Cost Centers:
- Blockchain: Alchemy (Base RPC), Bankr (LP provisioning), gas fees
- AI: Perplexity Computer, Jasper, Midjourney, Bannerbear, Replicate
- Infrastructure: Supabase, Raindrop, Auth0, Snyk, Vault/Doppler
- Communications: Customer.io, Intercom, Twilio/Knock
- Banking: Mercury, Ramp, Stripe fees, Circle fees

### Treasury Management:
- Operating account: Mercury
- Crypto treasury: Bankr + Safe multi-sig
- $BNKR position: Maintained for liquidity boost inventory
- Spend oversight: Ramp virtual cards per agent
- Reporting: Digits (real-time P&L)

---

## ONBOARDING NEW TEAM MEMBERS OR AGENTS

1. Read CLAUDE.md (platform vision and operating principles)
2. Read this file (org structure and roles)
3. Read TOOLS_REGISTRY.md (full tool stack with use cases)
4. Read SKILLS_REGISTRY.md (91 agent skills with IronBridge mappings)
5. Read docs/architecture.md (technical platform diagram)
6. Read monitoring/runbooks.md (what to do when things break)
7. Get credentials provisioned via Vault/Doppler (humans: request from team lead)
8. First task: shadow the Launch Coordinator Agent on 3 live launches

---

Last updated: 2026-04-06 | IronBridge AI Team
