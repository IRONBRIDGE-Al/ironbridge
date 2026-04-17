---
tags: [agents, ironbridge, command-center]
status: ACTIVE
deployment_phase: S61-S63
last_updated: 2026-04-17
---

# IronBridge Agent Command Center

Master index of all IronBridge agents (16 total: 16 ratified as of S67, COFFEY added S67).

## Agent Roster

| Agent | Role | Status | Skills | Due | Notes |
|-------|------|--------|--------|-----|-------|
| [[dick\|Dick]] | Commander/2IC | DEPLOYED | 24 | — | Custom code active. Core command & coordination. |
| [[sarge\|Sarge]] | Security Chief | ONLINE | 10 | — | Zero-trust enforcement. Needs onMission handler. |
| [[brooks\|Brooks]] | Code Quality | ONLINE | 16 | — | Test coverage >80%, lockfile policing. Bare template. |
| [[hermes\|Hermes]] | Memory & Sync | DEPLOYED | 8 | — | Custom code. JWT proxy, drift detection active. |
| [[oscar\|Oscar]] | Frontend | ONLINE | 12 | S63 | Component library, Vercel/Next.js. Bare template. |
| [[rachel\|Rachel]] | Intelligence | ONLINE | 9 | S62 | SEO, competitor analysis, market research. Bare template. |
| [[gary\|Gary]] | Growth & Partnerships | ONLINE | 17 | S62 | Copywriting, marketing, BNKR pipeline. Bare template. |
| [[paul\|Paul]] | Product | ONLINE | 10 | S63 | Supabase, onboarding, pricing. Bare template. |
| [[ezra\|Ezra]] | QA & Audit | ONLINE | 7 | S61 | Performance audit, pre-deploy verification. Bare template. |
| [[ripley\|Ripley]] | Deployment | ONLINE | 8 | S61 | Incident response, deploy-conductor. Bare template. |
| [[vetter\|Vetter]] | Discovery & Vetting | RATIFIED | 22 | S65 | Dual-mandate: safety gate + zero-capital revenue. Pending code. |
| [[athena\|Athena]] | Continuous Improvement | RATIFIED | TBD | S65 | Inward scout. Reads event log, proposes improvements. |
| [[candor\|Candor]] | PDS / User-Facing Intelligence | RATIFIED | 14 | S65 | Memory + Privacy + Voice. Ratified S66. |
| [[wick\|Wick]] | Personal Security Lead | RATIFIED | 12 | S65 | Boss protection, threat intel, OSINT, investigation. Restored LAW 71 original mission. Ratified S66. |
| [[argus\|Argus]] | Empire Auditor | RATIFIED | 6 | S66 | LAW 333 independent read-only auditor. Cold log integrity, cross-audit, governance drift. |
| [[coffey\|Coffey]] | The Healer | DEPLOYED | 10 | S67 | Infrastructure resilience. Heartbeat watchdog, platform health monitor (13 platforms), auto-recovery. Custom code active S69. |

## Deployment Schedule

- **S61**: Ezra (QA & Audit), Ripley (Deployment)
- **S62**: Rachel (Intelligence), Gary (Growth & Partnerships)
- **S63**: Oscar (Frontend), Paul (Product)

## Operational Status Summary

- **DEPLOYED (Custom Code)**: Dick, Hermes (2 agents)
- **ONLINE (Bare Template)**: Brooks, Oscar, Rachel, Gary, Paul, Ezra, Ripley, Sarge (8 agents)
- **RATIFIED (Pending Code)**: Vetter, Athena, Candor, Wick (4 agents — scaffold only)
- **RATIFIED (S66, New)**: Argus (Empire Auditor — scaffold + first skill)

## Cross-References

- [[Governance]]: Command protocols, oversight rules
- [[Security-Posture]]: Zero-trust architecture, ACL, credential rotation
- [[API-Budget]]: Rate limiting, circuit breakers
- [[Obsidian-Integration]]: Memory sync, vector search, documentation standards
- [[Test-Coverage]]: Minimum 80% enforcement by Brooks
- [[Deployment-SLA]]: Phase windows, incident procedures

---
Last updated: 2026-04-16 (S66 — CANDOR ratified, WICK ratified, ARGUS ratified + scaffolded)
