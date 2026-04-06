# CLAUDE.md — IronBridge AI Agent Memory

> This file is the persistent memory and operating context for Claude and all AI agents working on the IronBridge / IronForge platform. Always read this file first before taking any action in this repo.
>
> ---
>
> ## What Is IronBridge?
>
> IronBridge is a beginner-friendly, all-in-one meme coin launch platform built on Base and powered by $BNKR (Bankr). The mission is simple:
>
> > "Everything is already done for them."
> >
> > A user with zero technical knowledge can launch a token in under 10 minutes. No coding. No jumping between platforms. No sign-ups to manage. IronBridge does all the legwork. Where full automation is not possible, we provide a clean Optional Tab so the user is never blocked.
> >
> > ---
> >
> > ## Core Product: IronForge Launch Packages
> >
> > Three tiers — all pre-packaged, all beginner-ready:
> >
> > | Package | Price | Key Inclusions |
> > |---|---|---|
> > | Starter | $49 one-time | Token on Base (ERC-20), $500 LP, X template, Telegram bot, one-page website, simple dashboard, 7-day content pack |
> > | Growth | $99 + $19/mo | Everything in Starter + $2,000 liquidity, Discord server, Farcaster profile, live chart dashboard, 30-day marketing, auto price tweets, $BNKR liquidity boost |
> > | Viral | $199 + $39/mo | Everything in Growth + $5,000 liquidity, custom meme art pack, multi-chain option, priority exposure, dedicated Discord, white-glove support |
> >
> > ---
> >
> > ## Platform Integration Architecture
> >
> > Every launch package automatically deploys across these platforms. The user never has to sign up or configure anything manually:
> >
> > | Platform | What We Deploy | Status |
> > |---|---|---|
> > | Base (ERC-20) | Token contract deployment via Bankr | Automated |
> > | Liquidity Pool | Pre-funded LP on Base DEX | Automated |
> > | Website | One-page site with branding | Automated |
> > | X (Twitter) | Profile template, bio, auto price tweets | Automated |
> > | Telegram | Bot setup (basic + advanced) | Automated |
> > | Discord | Server setup, channels, bots | Automated (Growth+) |
> > | Farcaster | Profile creation and sync | Automated (Growth+) |
> > | Dashboard | Live chart + portfolio dashboard | Automated |
> > | $BNKR Routing | Bankr liquidity boost integration | Automated (Growth+) |
> > | Multi-chain | Optional multi-chain expansion | Optional Tab (Viral) |
> > | Payment | Stripe + Base crypto accepted | Both supported |
> >
> > Golden Rule: If we cannot fully automate it, it goes behind an Optional Tab — never a blocker.
> >
> > ---
> >
> > ## $BNKR Alignment
> >
> > - All packages are $BNKR aligned. Bankr is the core infrastructure powering token deployment and liquidity on Base.
> > - - Growth and Viral tiers include a $BNKR liquidity boost — key differentiator.
> >   - - Pricing is designed to be accessible so beginners are never priced out.
> >     - - The platform runs on Base chain — low fees, fast, beginner-friendly.
> >      
> >       - ---
> >
> > ## AI Agent Operating Principles
> >
> > 1. Always keep the beginner user in mind. Every decision should reduce friction for non-technical users.
> > 2. 2. Automate everything possible. Manual steps for users = failure. If something cannot be automated, create an Optional Tab.
> >    3. 3. $BNKR first. All liquidity, boosts, and chain decisions default to Bankr on Base.
> >       4. 4. Monitor like a real business. The system should be operational 24/7 — always check for failures, stale integrations, or broken platform connections.
> >          5. 5. Optional Tab over Blocker. Never leave a user stuck. If a platform integration is unavailable, route them to an optional manual path.
> >             6. 6. Team-only repo. This repo is private to the IRONBRIDGE-Al team. Never expose API keys, wallet addresses, or user data publicly.
> >                7. 7. Preserve user data. Never delete user submissions, launch records, or dashboard data.
> >                  
> >                   8. ---
> >                  
> >                   9. ## Repo Structure (Target Architecture)
> >                  
> >                   10. ironbridge/
> >   CLAUDE.md                  (This file — AI memory + context)
> >   README.md                  (Public-facing product overview)
> >   SKILLS_REGISTRY.md         (All 91 ZHC agent skills mapped to IronBridge)
> >   docs/
> >     architecture.md          (Full platform integration diagram)
> >     packages.md              (Detailed package specs)
> >     optional-tabs.md         (All Optional Tab integrations)
> >   skills/                    (Agent skill files by category)
> >     discovery/
> >     frontend/
> >     design/
> >     development/
> >     productivity/
> >     marketing/
> >     testing/
> >     backend/
> >     cloud/
> >     mobile/
> >     automation/
> >   platform-integrations/     (Per-platform integration configs)
> >     base/
> >     bankr/
> >     x-twitter/
> >     telegram/
> >     discord/
> >     farcaster/
> >     dashboard/
> >   monitoring/                (Business health monitoring configs)
> >     uptime.md
> >     alerts.md
> >     runbooks.md
> >
> > ---
> >
> > ## Monitoring and Business Health
> >
> > IronBridge operates like a real business — always on, always monitored:
> >
> > - Uptime monitoring on all platform integrations (Base RPC, Bankr API, X bot, Telegram bot, Discord bot, Farcaster)
> > - - Alert runbooks for when integrations go down
> >   - - Dashboard health checks — every user live dashboard must stay live
> >     - - $BNKR price feeds — must stay accurate and current
> >       - - Launch queue monitoring — all in-progress launches tracked to completion
> >        
> >         - ---
> >
> > ## ZHC Agent Skills Integration
> >
> > 91 skills from the ZHC Institute (zhcinstitute.com/skills/) are mapped to IronBridge workflows. See SKILLS_REGISTRY.md for the full list. Key skill categories in use:
> >
> > - Discovery — Finding and onboarding new platform integrations
> > - - Frontend and Design — User-facing launch form, dashboard UI
> >   - - Development — Token deployment scripts, API integrations
> >     - - Productivity and Brainstorming — Launch planning, content strategy
> >       - - Marketing — SEO, copywriting, social content for user token launches
> >         - - Testing — Website audits, webapp testing for each launch
> >           - - Automation — Browser automation for platform setups
> >             - - Cloud (Azure) — Infrastructure and observability
> >               - - Backend — Supabase/Postgres for launch data persistence
> >                
> >                 - ---
> >
> > ## Session Notes
> >
> > - Date initialized: 2026-04-06
> > - - Team: IRONBRIDGE-Al
> >   - - Chain: Base
> >     - - Token alignment: $BNKR (Bankr)
> >       - - Telegram context: Platform integration strategy discussed; focus on beginner UX, all-in-one packaging, optional tabs for partial integrations
> >         - - Status: Active development — building out full platform integration system
> >          
> >           - ---
> >
> > This memory file is maintained by the IronBridge AI team. Update it whenever major architectural decisions are made.
