[IRONBRIDGE-BRIEF.md](https://github.com/user-attachments/files/26520974/IRONBRIDGE-BRIEF.md)
# IRONBRIDGE PROJECT BRIEF
*For Claude — pull this at the start of any conversation*

## The Owner
- Builds fast, thinks in systems
- Wants everything delegated — does not want to manage details himself
- Pushes back when things aren't being delegated properly
- Goal: agent runs itself, owner just sets direction


## The Project — Ironbridge Assistant
- AI agent team running on agnt.social (OpenClaw platform)
- Accessible via Telegram bot
- Deployed at: IronBridge-jade.vercel.app (Vercel)
- GitHub org: github.com/IRONBRIDGE-Al
- Repo: github.com/IRONBRIDGE-Al/ironbridge

## Agent Team Structure
- **Dick** — Orchestrator / Crown Prince. Routes tasks to leads.
- **Product Paul** — Product strategy
- **Ops Oscar** — Operations and architecture
- **Radar Rachel** — Research and market intelligence
- **Growth Gary** — Growth and distribution
- **Shield Sam** — Security
- **Brooks** — Security implementation / fixer

## Standing Rules (Owner's preferences)
- Always delegate — Dick handles routing, leads handle execution
- Use Haiku for cheap/routine tasks, Sonnet only for deep reasoning
- Run /compact after every session to compress memory
- Monitor API spend — alert owner before credits run low
- New tool added → ask leads what they can use it for → implement
- Someone should always be checking system health

## Current Priorities (as of April 6, 2026)
1. Top up Anthropic API credits (agent is currently down)
2. Rotate exposed Telegram bot tokens via @BotFather
3. Push ironbridge-landing/ to GitHub so Vercel redeploys English site
4. Build the HAND System — autonomous scheduled packages (top team priority)

## HAND System (top priority)
- Inspired by OpenFang (github.com/RightNow-AI/openfang)
- HAND.toml manifest-driven autonomous packages
- Agents run on cron schedules, not waiting for owner input
- First hands to build: Researcher, Lead, Twitter/X

## Key References Added to Team
- OpenFang — Agent OS in Rust (github.com/RightNow-AI/openfang)
- MCP-USE — MCP tools for agents
- claude-skills — Skill system
- DeepLake — Vector database
- MemOS — Memory OS
- PraisonAI — Agent framework
- Edict — Multi-agent structure validation

## How to Use This Brief
At the start of any new Claude conversation, paste the URL:
github.com/IRONBRIDGE-Al/ironbridge/blob/main/IRONBRIDGE-BRIEF.md

Or just say: "Pull my Ironbridge brief" and share this URL.
Claude will read it and pick up where things left off.
