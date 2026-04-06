# TOOLS_REGISTRY.md — IronBridge Agent-Native Tools Registry

74 curated tools from ZHC Institute mapped across two lenses:
1. PLATFORM LENS — how each tool serves IronBridge/IronForge users launching tokens
2. ORG LENS — how each tool serves the IRONBRIDGE-Al team internally

Source: https://www.zhcinstitute.com/resources/tools/
Last updated: 2026-04-06

---

## TIER 1 — CORE: Tools that power IronBridge directly (use NOW)

These are non-negotiable infrastructure tools that either already exist in IronBridge or must be integrated immediately.

---

### BANKR — Finance / Blockchain
- What it is: AI infrastructure for self-sustaining agents. Cross-chain wallets, token launchpad via fair launch, autonomous trading fees that fund compute.
- Platform Lens: THIS IS OUR FOUNDATION. Every IronForge token launch runs through Bankr. $BNKR alignment. The fair launch launchpad IS the product. LP funding, trading fees, $BNKR boost — all Bankr.
- Org Lens: IronBridge as an organization can run its own treasury through Bankr. Agent wallets for operational expenses. Self-sustaining compute funding.
- Priority: CRITICAL — Already integrated
- Pricing: Free to start

---

### STRIPE — Payments
- What it is: Financial OS for autonomous economies. Billing, Connect, Issuing. Programmatic money movement without human intervention.
- Platform Lens: IronForge accepts Stripe payments for all packages (Starter $49, Growth $99+$19/mo, Viral $199+$39/mo). Subscription management, upgrades, receipts — all automated.
- Org Lens: IronBridge revenue collection, team payouts, vendor payments — all through Stripe API. No human CFO needed.
- Priority: CRITICAL — Must integrate for package payments
- Pricing: Paid

---

### SUPABASE — Data / Backend
- What it is: Open-source Firebase alternative with Postgres. Database, Auth, Storage APIs.
- Platform Lens: Stores all user launch data — token name, ticker, wallet, package tier, launch status, dashboard state. The source of truth for every IronForge deployment.
- Org Lens: IronBridge team knowledge base, operational data, agent state storage. Every automated workflow reads/writes here.
- Priority: CRITICAL — Must integrate immediately
- Pricing: Paid (free tier available)

---

### BROWSER USE — Infrastructure / Automation
- What it is: Open-source Python library for AI agents to control web browsers. Natural language to browser actions.
- Platform Lens: Powers the automation of platform setups — Discord server creation, Farcaster profile setup, X profile configuration. Anywhere we can't use an API, Browser Use fills the gap.
- Org Lens: Internal team automation — agents can handle any web-based task without human intervention. Key for Optional Tab flows.
- Priority: CRITICAL — Core automation layer
- Pricing: Free (Cloud option available)

---

### RAINDROP — Observability
- What it is: Sentry for AI Agents. Real-time monitoring, silent failure detection, A/B testing, Slack alerts.
- Platform Lens: Monitors every IronForge launch in real-time. Detects silent failures in platform integrations (did the Discord server actually get created? Is the Telegram bot responding?). Alerts team when a user launch fails.
- Org Lens: IronBridge business health monitoring. Every agent workflow is observed. Abnormal trajectories caught before they become user problems.
- Priority: CRITICAL — This IS the "monitor like a real business" requirement
- Pricing: 14-day trial then paid

---

### PERPLEXITY COMPUTER — Agent Orchestration
- What it is: Multi-model orchestration platform. 19 AI models, one coordinator. Routes tasks to best-suited model. Personal Computer variant runs 24/7.
- Platform Lens: Orchestrates the full IronForge launch sequence — different models handle different steps (token deployment logic, content generation, SEO, social copy). Parallel execution = faster launches.
- Org Lens: IronBridge's central AI brain. Routes tasks across Claude, Gemini, GPT, Grok. Background operation means 24/7 coverage without human monitoring.
- Priority: HIGH — Enables multi-agent architecture
- Pricing: Free to start

---

### ALCHEMY — Blockchain Infrastructure
- What it is: Web3 development platform and node provider. Supernode, NFT API, Notify.
- Platform Lens: Base chain node access for token deployment. Real-time transaction notifications for user dashboards. NFT API for future meme NFT features.
- Org Lens: IronBridge's blockchain infrastructure backbone. All on-chain reads/writes go through Alchemy.
- Priority: HIGH — Core blockchain layer
- Pricing: Paid

---

### AUTH0 — Security / Identity
- What it is: Identity as a service. Auth API, Universal Login, Multi-Factor Auth.
- Platform Lens: User authentication for IronForge dashboard access. Secure login without building auth from scratch. Magic links and social login for beginner-friendly onboarding.
- Org Lens: Team access control. Agent identity management. Secure API access.
- Priority: HIGH — Required for user dashboard
- Pricing: Paid

---

### NEBULA — Automation
- What it is: AI employee platform. 24/7 inbox management, tool sync, workflow automation. Slack-like interface with intelligent agents. Integrates with Google Suite, GitHub, Slack, Notion, Linear.
- Platform Lens: Manages IronBridge operational workflows — user support tickets, launch notifications, platform alerts. Agents handle customer communication automatically.
- Org Lens: CORE ORG TOOL. Replaces human operations roles. Every business workflow has an agent channel. Connected to all IronBridge tools.
- Priority: HIGH — Internal operations layer
- Pricing: Free

---

### DO ANYTHING — Automation
- What it is: Autonomous agent that executes real work. Email, phone calls, web browsing, code, documents, websites, images, subagents, 3,000+ app connections. Can create its own identity to sign up for services.
- Platform Lens: The agent that actually DOES the platform setups. Creates Discord servers, sets up Telegram bots, registers Farcaster profiles — where APIs aren't available, this agent handles it.
- Org Lens: IronBridge's autonomous workforce for tasks that need a human-like identity. Signs up for services on behalf of user token launches.
- Priority: HIGH — Critical for automation gaps
- Pricing: Free

---

## TIER 2 — PLATFORM GROWTH: Tools that enhance the IronForge product

---

### OUTSETA — Automation / Membership
- What it is: All-in-one membership management. Payments, auth, content gating, CRM, email marketing, support — autonomous.
- Platform Lens: Could replace or augment the IronForge subscription management. Handles the Growth and Viral recurring billing, gated dashboard access by tier, and automated email sequences to token holders.
- Org Lens: IronBridge subscription business management without human ops staff.
- Priority: HIGH — Consider for membership/subscription layer
- Pricing: 7-day free trial

---

### MANUS — Development
- What it is: Full-stack web app builder from natural language. Production-ready code with database, backend, SEO, analytics.
- Platform Lens: Generates the one-page token websites included in all IronForge packages. User provides token name, ticker, backstory — Manus generates the full site automatically.
- Org Lens: IronBridge internal tooling and admin dashboards built without developers.
- Priority: HIGH — Core to the website delivery in packages
- Pricing: Free

---

### REPLIT — Development
- What it is: AI-native dev platform. Natural language to full-stack apps. Autonomous deployment. No local setup.
- Platform Lens: Alternative/complement to Manus for generating user token websites. Also used for IronBridge platform development and rapid prototyping.
- Org Lens: Team development environment. Any team member (or agent) can build and deploy without dev environment setup.
- Priority: HIGH — Development acceleration
- Pricing: Free

---

### CUSTOMER.IO — Marketing
- What it is: Automated messaging triggered by real-time data. Multi-channel. Programmatic voice for autonomous brands.
- Platform Lens: Sends users launch confirmation emails, dashboard access links, 7-day content packs, progress notifications. Triggers based on launch stage completion. Upsell sequences for Starter -> Growth -> Viral upgrades.
- Org Lens: IronBridge brand communications. Onboarding sequences. Announcement campaigns.
- Priority: HIGH — User communication layer
- Pricing: Paid

---

### MIXPANEL — Analytics
- What it is: Product analytics for tracking user behavior. Real-time insights, user segmentation.
- Platform Lens: Tracks IronForge funnel — which packages convert, where users drop off in the launch form, which features drive upgrades. Data-driven product decisions.
- Org Lens: IronBridge business metrics. Revenue tracking, agent performance metrics, platform health KPIs.
- Priority: HIGH — Data-driven optimization
- Pricing: Paid

---

### LINEAR — Project Management
- What it is: Issue tracking for high-performance teams. API-driven, workflow automation, real-time collaboration.
- Platform Lens: Tracks IronBridge platform issues, feature requests, integration bugs. Every failed launch creates a Linear issue automatically via Raindrop.
- Org Lens: IronBridge's operational command center. Agents create and close issues. Team sprint management.
- Priority: HIGH — Org operations backbone
- Pricing: Paid

---

### NOTION — Project Management / Knowledge
- What it is: Connected workspace for docs and databases. Notion API, knowledge management.
- Platform Lens: IronBridge public roadmap, user FAQs, token launch guides. Knowledge base for users.
- Org Lens: IronBridge team wiki, SOPs, agent playbooks, decision logs. Every process documented.
- Priority: HIGH — Org knowledge base
- Pricing: Paid

---

### INTERCOM — Support
- What it is: AI-first customer service. Bots handle majority of inquiries. 24/7 autonomous support.
- Platform Lens: IronForge user support. "Why isn't my Discord live yet?" — Intercom bot handles it. Escalates only when truly needed. Beginner users need hand-holding — this provides it at scale.
- Org Lens: IronBridge has zero human support staff. Intercom IS the support department.
- Priority: HIGH — Critical for beginner user base
- Pricing: Paid

---

### CIRCLE — Payments / Crypto
- What it is: USDC and programmable money infrastructure. Bridge between TradFi and autonomous economies.
- Platform Lens: Accepts USDC payments for IronForge packages as an alternative to Stripe. Important for crypto-native users who want to pay with stablecoins. USDC liquidity management for LP provisioning.
- Org Lens: IronBridge treasury management in USDC. Cross-border payments to team/contractors.
- Priority: HIGH — Crypto payment rail
- Pricing: Paid

---

## TIER 3 — BLOCKCHAIN STACK: Web3 infrastructure for token launches

---

### SELFCLAW — Identity / Blockchain
- What it is: Sybil-resistant verification for AI agents. ZK identity proofs, self-custody wallets, ERC20 token deployment.
- Platform Lens: ERC20 token deployment verification layer. Prevents spam launches. Self-custody wallets for user token control. ZK proofs for trust without exposing user data.
- Org Lens: IronBridge agent identity verification. Trusted agent economy participation.
- Priority: MEDIUM-HIGH — Token security layer

---

### 0X — Crypto / DEX
- What it is: Liquidity aggregator for DEX. Swap API, smart order routing.
- Platform Lens: Powers the LP setup for IronForge token launches. Best price routing for $BNKR liquidity boosts. Token swap infrastructure for the dashboard.
- Org Lens: IronBridge treasury token swaps. Agent trading operations.
- Priority: MEDIUM-HIGH — LP and swap infrastructure

---

### CHAINLINK — Blockchain / Oracles
- What it is: Decentralized oracle network. Data feeds, VRF, automation.
- Platform Lens: Real-time price feeds for user token dashboards. Verifiable randomness for fair launch mechanics. Automation triggers for on-chain events.
- Org Lens: IronBridge's connection between blockchain and real-world data.
- Priority: MEDIUM — Price feeds for dashboards

---

### THE GRAPH — Blockchain / Indexing
- What it is: Decentralized indexing for blockchain data. GraphQL API, subgraphs.
- Platform Lens: Index all IronForge token launches on-chain. Power the live dashboard with historical trade data, holder counts, volume. Fast queries without hitting RPC directly.
- Org Lens: IronBridge's on-chain data layer for analytics and reporting.
- Priority: MEDIUM — Dashboard data infrastructure

---

### OPENZEPPELIN — Blockchain / Security
- What it is: Standard for secure smart contract development. Contracts library, Defender, security audits.
- Platform Lens: IronForge token contracts built on OpenZeppelin standards. Defender for real-time contract monitoring. Security audits for LP lock contracts.
- Org Lens: IronBridge's smart contract security foundation.
- Priority: MEDIUM — Contract security

---

### TENDERLY — Blockchain / Monitoring
- What it is: Full-stack blockchain dev and monitoring. Debugger, monitoring, simulations.
- Platform Lens: Monitor every IronForge token contract in real-time. Simulate transactions before execution. Debug launch failures at the contract level.
- Org Lens: IronBridge's on-chain observability layer.
- Priority: MEDIUM — Smart contract observability

---

### MORALIS — Blockchain / Data
- What it is: Enterprise-grade Web3 data API. Web3 data, Auth, Streams.
- Platform Lens: Cross-chain user authentication (wallet login for dashboard). Real-time on-chain streams for dashboard updates. NFT data for future features.
- Org Lens: IronBridge's Web3 data backbone for cross-chain features.
- Priority: MEDIUM — Web3 auth and data

---

### DUNE ANALYTICS — Crypto / Analytics
- What it is: Community-driven crypto data via SQL. On-chain research.
- Platform Lens: Public dashboards showing IronForge ecosystem metrics — total tokens launched, TVL, $BNKR volume. Transparency and trust for the platform.
- Org Lens: IronBridge on-chain analytics for business decisions.
- Priority: MEDIUM — Ecosystem analytics and transparency

---

### SNAPSHOT — Governance
- What it is: Off-chain voting for decentralized governance. No gas fees.
- Platform Lens: Future: token holder governance for IronForge ecosystem decisions. Users who hold launched tokens can vote on platform features. $BNKR governance alignment.
- Org Lens: IronBridge team governance. Decentralized decision-making for roadmap.
- Priority: LOW-MEDIUM — Future governance layer

---

### SAFE — Governance / Finance
- What it is: Multi-sig wallet and programmable treasury.
- Platform Lens: LP lock mechanism for IronForge token launches. Users can lock liquidity in a Safe multi-sig for trust. Future: community treasury management.
- Org Lens: IronBridge organizational treasury. Multi-sig for large financial decisions. Agent co-signing for security.
- Priority: MEDIUM — Treasury and LP lock security

---

## TIER 4 — ORG INFRASTRUCTURE: Tools that run the IronBridge organization

---

### COFOUNDER — Agent Orchestration
- What it is: Agent orchestration platform. Natural language commands run entire company. CRM, email, calendar, Notion, Linear, Slack. Knowledgebase agent. 100+ tool integrations.
- Platform Lens: Could orchestrate the full IronForge launch sequence as a company-level operation.
- Org Lens: THIS IS THE IRONBRIDGE OPERATING SYSTEM. Natural language commands spin up agents that handle every business function. The knowledgebase agent keeps all company memory updated. Zero-human operations.
- Priority: HIGH — Core org operating layer
- Pricing: Free

---

### HERMES AGENT — AI Agents
- What it is: Open-source agent from Nous Research. Multi-level memory system. Persistent machine access. Learns and grows over time.
- Platform Lens: Dedicated persistent agent for IronBridge platform monitoring. Remembers every launch, every failure, every fix. Gets smarter over time.
- Org Lens: IronBridge's long-term memory agent. Builds institutional knowledge. Never forgets a past decision or pattern.
- Priority: HIGH — Persistent organizational memory
- Pricing: Free

---

### SUPERMEMORY — Memory
- What it is: Universal Memory API. RAG, user profiles, connectors, extractors. 50M tokens per user. 5B tokens daily.
- Platform Lens: Memory layer for user preferences, past launches, token history. Agents remember each user across sessions for personalized support.
- Org Lens: IronBridge's organizational memory infrastructure. All agent knowledge persisted and queryable. RAG over company history.
- Priority: HIGH — Memory infrastructure
- Pricing: Free

---

### SPACEBOT — Infrastructure / Multi-Agent
- What it is: AI operating system for autonomous agent teams. Multi-agent architecture, memory graph, Cortex supervision.
- Platform Lens: Infrastructure for running the IronForge launch pipeline as coordinated agent swarms. Multiple agents working in parallel on different steps of a single launch.
- Org Lens: IronBridge's agent team operating system. Cortex supervision ensures agents stay on task. Memory graph connects all agent knowledge.
- Priority: HIGH — Multi-agent coordination
- Pricing: $29/month

---

### NVIDIA NEMOCLAW — Security
- What it is: Policy-based guardrails for autonomous AI agents. Model sandboxing, data privacy. Built with CrowdStrike, Cisco, Microsoft Security.
- Platform Lens: Security guardrails for all IronBridge agents. Prevents agents from taking unauthorized financial actions. Data privacy for user wallet addresses and personal info.
- Org Lens: IronBridge's AI security layer. No agent can act outside defined policies. Critical for a financial platform.
- Priority: HIGH — AI security guardrails
- Pricing: Paid

---

### AGENTMAIL — Communication
- What it is: Email inboxes for AI agents. API-first. Two-way conversations. Webhooks.
- Platform Lens: Each IronForge launched token can have its own agent email inbox for community management. Launch confirmations sent from dedicated agent emails.
- Org Lens: IronBridge agents have their own email identities. Customer communication handled agent-to-human over email autonomously.
- Priority: MEDIUM-HIGH — Agent email infrastructure
- Pricing: Free

---

### MERCURY — Finance / Banking
- What it is: Banking for startups. Programmatic banking, global payouts, virtual cards.
- Platform Lens: IronBridge primary bank account. Revenue flows in from Stripe/Circle, expenses flow out programmatically. No human CFO needed.
- Org Lens: IronBridge organizational banking. Virtual cards for agent spending. Global payouts to team.
- Priority: HIGH — Org banking
- Pricing: Free

---

### RAMP — Finance
- What it is: Spend management and corporate cards. Virtual cards, real-time reporting.
- Platform Lens: Agent spending limits for compute costs (API calls, infrastructure). Each integration has a budget cap enforced by Ramp.
- Org Lens: IronBridge expense control. Every agent has a virtual card with programmatic limits. Real-time spend visibility.
- Priority: MEDIUM-HIGH — Spend control
- Pricing: Free

---

### DIGITS — Accounting
- What it is: AI-native accounting. Real-time financials, automated reconciliation. Autonomous CFO.
- Platform Lens: IronBridge financial reporting. Revenue per package tier, cost per launch, margin analysis — all automated.
- Org Lens: IronBridge's autonomous finance department. No accountants needed. Real-time P&L always visible.
- Priority: MEDIUM-HIGH — Financial operations
- Pricing: Paid

---

### DEEL — HR
- What it is: Global payroll and compliance for remote teams. Contractor management.
- Platform Lens: Pays any contractors/developers working on IronBridge integrations globally. Compliance automated.
- Org Lens: IronBridge global team payments. Contract management. Zero HR overhead.
- Priority: MEDIUM — HR infrastructure
- Pricing: Paid

---

### VANTA — Compliance
- What it is: Automated compliance and security monitoring. SOC 2, ISO 27001, HIPAA.
- Platform Lens: IronBridge compliance for handling user financial data. SOC 2 certification builds trust with enterprise users.
- Org Lens: IronBridge trust layer. Continuous monitoring ensures we stay compliant as we scale.
- Priority: MEDIUM — Compliance (important as platform scales)
- Pricing: Paid

---

### HASHICORP VAULT — Security
- What it is: Identity-based secrets and encryption. Programmatic vault for autonomous security.
- Platform Lens: Stores API keys for all platform integrations (Discord bot tokens, Telegram API keys, X API credentials). Never hardcoded. Rotated automatically.
- Org Lens: IronBridge secrets management. All sensitive configuration centralized and secured.
- Priority: HIGH — Secrets management
- Pricing: Paid

---

### DOPPLER — Security
- What it is: Centralized secret management. Environment sync, access control.
- Platform Lens: Developer-friendly alternative to Vault for managing IronBridge integration secrets. Syncs across dev/staging/prod environments.
- Org Lens: IronBridge configuration management. Every environment consistently configured.
- Priority: HIGH — Secrets/config management
- Pricing: Paid (use either Vault or Doppler, not both)

---

### 1PASSWORD CONNECT — Security
- What it is: Secrets automation server for programmatic access.
- Platform Lens: Agent access to integration credentials without exposing secrets in code.
- Org Lens: Team password and secrets management. Agents access credentials programmatically.
- Priority: MEDIUM — Credential management
- Pricing: Paid

---

### SNYK — Security
- What it is: Developer security for code and dependencies. Automated fixing, continuous monitoring.
- Platform Lens: Scans IronBridge codebase for vulnerabilities. Automated PRs to fix security issues. Critical for a financial platform handling user wallets.
- Org Lens: IronBridge code security. Every commit scanned. Vulnerabilities auto-remediated.
- Priority: HIGH — Code security
- Pricing: Paid

---

## TIER 5 — CONTENT & DESIGN: Token launch creative assets

---

### MIDJOURNEY — Design
- What it is: AI image generation. Style customization, high-resolution output.
- Platform Lens: AUTO-GENERATES meme art and logos for user token launches. User uploads an image or describes their vibe — Midjourney creates the full art pack included in Viral tier. Custom meme art pack = Midjourney automated.
- Org Lens: IronBridge marketing assets. Social media visuals. Brand content.
- Priority: HIGH — Core to Viral tier deliverable
- Pricing: Paid

---

### BANNERBEAR — Design
- What it is: API for automated image and video generation. Template editor.
- Platform Lens: Generates social media banners, announcement images, and marketing templates for every IronForge token launch automatically. Templated by package tier — Starter gets basic, Viral gets premium.
- Org Lens: IronBridge marketing asset automation. Consistent branded output at scale.
- Priority: HIGH — Automated creative for all launches
- Pricing: Paid

---

### RUNWAY — Design / Video
- What it is: AI-powered video generation and editing. Custom model training.
- Platform Lens: Generates launch announcement videos for token projects. Viral tier gets a custom launch video. Social media content for the 30-day marketing pack.
- Org Lens: IronBridge brand video content. Platform demo videos. Marketing campaigns.
- Priority: MEDIUM — Premium tier video content
- Pricing: Paid

---

### JASPER — Marketing
- What it is: AI content generation. Brand voice management, workflow integration.
- Platform Lens: Generates the 7-day and 30-day content packs included in IronForge packages. Social posts, blog content, community announcements — all auto-generated for each token.
- Org Lens: IronBridge marketing content. Blog posts, landing page copy, email sequences.
- Priority: HIGH — Content pack delivery
- Pricing: Paid

---

### REPLICATE — Infrastructure / AI Models
- What it is: Run open-source ML models via API. Thousands of models, automatic scaling.
- Platform Lens: Run image generation models (alternatives to Midjourney), speech synthesis for content, video models. Pay-per-use = cost-efficient at scale.
- Org Lens: IronBridge AI model infrastructure. Access any ML capability without managing GPUs.
- Priority: MEDIUM — AI model flexibility
- Pricing: Usage-based

---

## TIER 6 — DATA & ANALYTICS: Intelligence layer

---

### PINECONE — Data / Memory
- What it is: Vector database for AI applications. Serverless, real-time indexing.
- Platform Lens: Semantic search over all token launches, user preferences, support history. RAG-powered agent responses using launch history as context.
- Org Lens: IronBridge's long-term vector memory. Semantic search over all company knowledge.
- Priority: MEDIUM-HIGH — AI memory and search
- Pricing: Paid

---

### NEON — Data
- What it is: Serverless Postgres with branching. Autoscaling.
- Platform Lens: Alternative/complement to Supabase for IronBridge database. Database branching for safe schema changes. Serverless scales with launch volume.
- Org Lens: IronBridge development database. Branching enables safe experimentation.
- Priority: MEDIUM — Database infrastructure
- Pricing: Paid

---

### AIRBYTE — Data / ETL
- What it is: Open-source data integration. 300+ connectors, ETL platform.
- Platform Lens: Syncs data between IronBridge tools — Supabase to Mixpanel, Stripe revenue to Digits, on-chain data to dashboards. Single source of truth.
- Org Lens: IronBridge data pipeline. All tools connected. No data silos.
- Priority: MEDIUM — Data integration
- Pricing: Paid

---

### SEGMENT — Analytics / Data
- What it is: Customer data platform. Connections, Protocols, Personas.
- Platform Lens: Routes user behavior data from IronForge to Mixpanel, Customer.io, Intercom. Single tracking implementation feeds all downstream tools.
- Org Lens: IronBridge's data orchestration layer. Write tracking once, route everywhere.
- Priority: MEDIUM — Data routing
- Pricing: Paid

---

### PARALLEL — Data / Search
- What it is: Highest accuracy web search API for AI agents. SOC-II certified. Cross-referenced facts.
- Platform Lens: Agents use Parallel to research optimal launch timing, competitor analysis, trending meme formats. Real-time market intelligence for token launches.
- Org Lens: IronBridge's research engine. Agents stay current on Base ecosystem, $BNKR news, market conditions.
- Priority: MEDIUM — Research and intelligence
- Pricing: Up to 20,000 requests free

---

## TIER 7 — SALES & GROWTH: Scaling the IronBridge business

---

### APOLLO.IO — Sales
- What it is: Sales intelligence and engagement. Autonomous lead generation.
- Platform Lens: Identifies crypto projects, meme communities, and Base ecosystem users who should be IronForge customers. Autonomous outreach campaigns.
- Org Lens: IronBridge's autonomous sales team. No human SDRs needed.
- Priority: MEDIUM — Growth acceleration
- Pricing: Paid

---

### ATTIO — Sales / CRM
- What it is: Data-driven CRM. Workflow automation, programmatic relationship management.
- Platform Lens: Tracks IronForge leads, conversions, churned users. Identifies upgrade opportunities (Starter -> Growth -> Viral).
- Org Lens: IronBridge's relationship management system. Partner and investor relations tracked here.
- Priority: MEDIUM — CRM infrastructure
- Pricing: Paid

---

### 11X — Sales
- What it is: Autonomous AI SDR platform. Multi-channel outreach, lead qualification.
- Platform Lens: Automates outbound outreach to potential IronForge users. Identifies and qualifies token launcher leads.
- Org Lens: IronBridge's autonomous sales force. Scales without hiring human SDRs.
- Priority: LOW-MEDIUM — Sales automation (after core platform stable)
- Pricing: Paid

---

## TIER 8 — COMMUNICATION: Team and user communications

---

### TWILIO — Communication
- What it is: Global SMS, Voice, Video APIs.
- Platform Lens: SMS notifications for IronForge launch milestones ("Your token is live!"). Phone call verification for high-value Viral tier customers. Dashboard alerts via SMS.
- Org Lens: IronBridge agent communications. Automated SMS/voice for critical alerts.
- Priority: MEDIUM — User notifications
- Pricing: Paid

---

### KNOCK — Communication
- What it is: Notification infrastructure. Multi-channel, workflow engine.
- Platform Lens: Orchestrates all IronForge user notifications across email, SMS, in-app, push. Single notification API for all channels.
- Org Lens: IronBridge alert infrastructure. Team and agent notifications centralized.
- Priority: MEDIUM — Notification orchestration
- Pricing: Paid

---

### VONAGE — Communication
- What it is: Communication APIs for SMS and Voice.
- Platform Lens: Alternative to Twilio for SMS/voice if needed. Global reach for international IronForge users.
- Org Lens: Backup communication infrastructure.
- Priority: LOW — Twilio alternative

---

## TIER 9 — LEGAL & COMPLIANCE: Protecting IronBridge

---

### CLERKY — Legal
- What it is: Startup legal automation. Formation, fundraising, hiring.
- Platform Lens: Legal infrastructure for IronBridge as a company. Formation documents, fundraising docs automated.
- Org Lens: IronBridge legal standing. Zero human lawyers needed for standard corporate actions.
- Priority: MEDIUM — Legal infrastructure
- Pricing: Paid

---

### IRONCLAD — Legal
- What it is: Digital contracting platform. Contract automation, lifecycle management.
- Platform Lens: IronForge Terms of Service agreements auto-generated and signed by users at launch. Partner integration contracts.
- Org Lens: IronBridge contract management. Vendor agreements, partner contracts, team agreements.
- Priority: MEDIUM — Contract automation
- Pricing: Paid

---

### SUMSUB — Compliance / KYC
- What it is: All-in-one KYC/KYB verification. Liveness detection, AML screening.
- Platform Lens: KYC for high-value Viral tier users. AML compliance for fiat payments. Required for regulatory compliance as platform scales.
- Org Lens: IronBridge compliance layer for financial operations.
- Priority: MEDIUM — Compliance (critical at scale)
- Pricing: Paid

---

### CHECKR — HR / Compliance
- What it is: API-first background checks. Global compliance.
- Platform Lens: Contractor verification for IronBridge team members with access to sensitive systems.
- Org Lens: IronBridge hiring compliance. Background checks automated.
- Priority: LOW — HR compliance
- Pricing: Paid

---

## TIER 10 — INFRASTRUCTURE: Low-level platform tools

---

### LM STUDIO — AI Infrastructure
- What it is: Run local LLMs on desktop. No cloud dependencies. Local API server.
- Platform Lens: Run AI models locally for sensitive operations (processing user wallet data, private token details). No data sent to external servers.
- Org Lens: IronBridge team local AI development. Privacy-preserving AI for sensitive workflows.
- Priority: MEDIUM — Privacy-sensitive AI operations
- Pricing: Free

---

### ZO COMPUTER — Infrastructure
- What it is: AI-powered cloud computer. 24/7 operation. Natural language development. Built-in hosting.
- Platform Lens: Hosts IronBridge automation scripts and agents. Always-on cloud execution.
- Org Lens: IronBridge's always-on cloud agent execution environment.
- Priority: MEDIUM — Agent hosting
- Pricing: Free

---

### PICOCLAW — Infrastructure
- What it is: $10 hardware AI assistant. Ultra-lightweight, 10MB footprint. Runs on ARM/x86/RISC-V.
- Platform Lens: Edge deployment for IronBridge monitoring agents. Ultra-low cost monitoring nodes.
- Org Lens: Low-cost agent infrastructure for high-volume, lightweight tasks.
- Priority: LOW — Edge/cost optimization
- Pricing: Free

---

### MAXCLAW — Infrastructure
- What it is: Cloud-hosted AI agent by MiniMax. One-click deploy, persistent memory, multi-platform.
- Platform Lens: Deploy IronBridge monitoring agents in seconds. Persistent memory across sessions.
- Org Lens: Rapid agent deployment for IronBridge team needs.
- Priority: MEDIUM — Rapid agent deployment
- Pricing: Paid

---

### KIMI CLAW — AI Coding
- What it is: OpenClaw in browser with agent swarm. 5,000+ community skills. 40GB cloud storage. Built on Kimi K2.5.
- Platform Lens: Access community skills for IronBridge-specific automation tasks. Visual coding for dashboard components.
- Org Lens: IronBridge team coding environment. Browser-based, no setup.
- Priority: MEDIUM — Development tooling
- Pricing: Free

---

## TIER 11 — LOGISTICS & SUPPLY CHAIN: Future physical layer

---

### FLEXPORT — Logistics
- What it is: Modern freight forwarding APIs. Supply chain visibility.
- Platform Lens: Future: physical merchandise for token communities (custom merch packs). Logistics automation.
- Org Lens: IronBridge physical goods if/when we add merchandise to packages.
- Priority: LOW — Future consideration
- Pricing: Paid

---

### SHIPPO — Logistics
- What it is: Multi-carrier shipping API. Rate comparison, label generation.
- Platform Lens: Same as Flexport — future merchandise fulfillment.
- Org Lens: IronBridge shipping if physical products added.
- Priority: LOW — Future consideration
- Pricing: Paid

---

### ANVYL — Supply Chain
- What it is: Supply chain relationship management. Procurement automation.
- Platform Lens: Not applicable to current IronBridge model.
- Org Lens: Future physical operations.
- Priority: LOW — Not applicable now

---

### TITO — Automation / Events
- What it is: Agent-accessible event management platform. API-first, no CAPTCHA.
- Platform Lens: IronBridge community events — token launch parties, AMA sessions, virtual events. Agent creates and manages events programmatically.
- Org Lens: IronBridge team events, community meetups, investor events.
- Priority: LOW-MEDIUM — Community building
- Pricing: Free

---

## MASTER PRIORITY MATRIX

### Implement IMMEDIATELY (Week 1-2):
Bankr, Supabase, Stripe, Browser Use, Raindrop, HashiCorp Vault/Doppler, Snyk, Auth0

### Implement SOON (Week 3-4):
Perplexity Computer, Alchemy, Nebula, Do Anything, Cofounder, Supermemory, Mercury, Jasper, Bannerbear, Midjourney, Customer.io, Linear, Notion, Intercom

### Implement WHEN SCALING (Month 2+):
Hermes Agent, Spacebot, NemoClaw, AgentMail, Ramp, Digits, Circle, Mixpanel, 0x, Chainlink, The Graph, OpenZeppelin, Tenderly, Manus, Replit, Outseta

### Implement AS NEEDED:
Apollo, Attio, Twilio, Knock, Vanta, Clerky, Ironclad, Sumsub, Pinecone, Segment, Airbyte, Neon, Parallel, Dune, Safe, Snapshot, Moralis, Replicate, Runway

### Future / Low Priority:
11x, Vonage, Checkr, Deel, Flexport, Shippo, Anvyl, Tito, PicoClaw, LM Studio, 1Password, Zo Computer

---

Last updated: 2026-04-06 | IronBridge AI Team
