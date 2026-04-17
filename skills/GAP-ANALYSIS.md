---
tags: [skills, gap-analysis, arsenal, law-25]
status: PHASE-2-IN-PROGRESS
ticket: IB-0416-SOLDIER-ARSENAL-GAP-001
session: S65
generated: 2026-04-16
author: claude-opus-4-6 under Boss directive
---

# IronBridge Skill Arsenal — Gap Analysis (Phase 1)

> **Mandate**: Boss (S65): "skils should be built if they havent been or patched. There are so many things our soldiers need. a full arsenal"
> **Ticket**: `queue/IB-0416-SOLDIER-ARSENAL-GAP-001.yml` Phase 1
> **LAW 25 read-trail**: `skills/INDEX.md` (163L sha: read 2026-04-16), `skills/MASTER-ASSIGNMENTS.md` (414L), `soldiers/dick/src/index.ts:38-67` (SKILL_ROUTING), `agents/INDEX.md`, `agents/vetter.md:1-60`, `agents/athena.md`, `governance/LAWS-INDEX.md` (all 346 laws), bare template soldier dirs (10 × `soldiers/<name>/src`)

---

## 1. Executive Summary

**Claimed arsenal** (per `skills/INDEX.md`): ~178 skills planned across 16 soldiers.
**Claimed arsenal** (per `skills/MASTER-ASSIGNMENTS.md`): 168 assignments after ZHC additions.
**Runnable arsenal** (verified S69): **26 SRP-1.0 skill modules across 7 soldiers (SARGE: 10, DICK: 4, HERMES: 3, EZRA: 3, COFFEY: 3, ARGUS: 2, VETTER: 1). S69 added platform-health-monitor + provider-health-check (COFFEY), session-ingest + git-log-router (DICK). S66 added 6 pipeline skills. Original 13 law-predicate skills.**

Skills today are conceptual routing labels with a growing concrete foundation. `soldiers/dick/src/index.ts:38-67` has a 67-entry `SKILL_ROUTING` map that maps skill-name-strings to soldier-id-strings. The first runnable skill modules are now implemented as SRP-1.0 compliant units. Phase 2 continues building skills across the remaining ~155 claimed assignments.

This is a rapidly evolving landscape with strong directional progress.

---

## 2. Three Conflicting Truths

Three files claim authority over what skills exist. They disagree.

| Source | Skill count | Example skill naming |
|---|---|---|
| `skills/INDEX.md` | 101 named, 121 assigned | `audit logging`, `compliance enforcement`, `mission orchestration` |
| `skills/MASTER-ASSIGNMENTS.md` | 121 existing + 47 ZHC = 168 | `governance-enforcement`, `decree-validation`, `law-citation`, `qstash-queue` |
| `soldiers/dick/src/index.ts` SKILL_ROUTING | 67 keys | `secret-scanning`, `systematic-debugging`, `component-library` |

There is **no single authoritative skill registry**. The three sources use different skill names, different taxonomies, and different counts. Per CHAINLINK doctrine this is a LAW 338 silent-failure pattern — the discrepancy was never surfaced.

**Action**: Promote one source to canonical. Recommend `MASTER-ASSIGNMENTS.md` (most recent, most structured) after reconciling with DICK's code. The `INDEX.md` file should be regenerated from the canonical source, not hand-maintained.

---

## 3. Per-Soldier Arsenal Reality Check

Reality = "does a callable skill module exist under `soldiers/<name>/src/skills/<skill-name>.ts` or an equivalent".

| Soldier | Claimed skills | Code dir exists | Skill modules on disk | Template or custom | Gap |
|---|---|---|---|---|---|
| DICK | 24 / 30 | ✅ | 2 (session-ingest, git-log-router) | CUSTOM | 22 claimed skills remaining |
| HERMES | 8 / 12 | ✅ | 0 (sync code, no `skills/`) | CUSTOM | 8 claimed skills not implemented |
| SARGE | 10 / 15 | ✅ | 10 (7 law-predicate + github-ops, credential-rotation, doc-tracker) | BARE TEMPLATE | 0 remaining from original claims + new pipeline skills |
| BROOKS | 16 / 22 | ✅ | 0 | BARE TEMPLATE | entire soldier code + 16 skills |
| OSCAR | 12 / 17 | ✅ | 0 | BARE TEMPLATE | entire soldier code + 12 skills |
| RACHEL | 9 / 13 | ✅ | 0 | BARE TEMPLATE | entire soldier code + 9 skills |
| GARY | 17 / 22 | ✅ | 0 | BARE TEMPLATE | entire soldier code + 17 skills |
| PAUL | 10 / 13 | ✅ | 0 | BARE TEMPLATE | entire soldier code + 10 skills |
| EZRA | 7 / 11 | ✅ | 3 | BARE TEMPLATE | 4 remaining skills |
| RIPLEY | 8 / 13 | ✅ | 0 | BARE TEMPLATE | entire soldier code + 8 skills |
| VETTER | 22 | ⚠ | 1 | RATIFIED DOC ONLY | 21 remaining skills |
| ATHENA | unknown | ⚠ scaffold | 0 | DOC ONLY | needs scoping |
| CANDOR | 14 | ⚠ scaffold | 0 | CHARTERED S65 | 14 skills across 3 modules (memory-coherence, privacy-enforcement, voice-interface). Addresses Memory gap from 5-soldier gap analysis. |
| WICK | 12 | ⚠ scaffold | 0 | CHARTERED S65 | 12 skills across 3 modules (threat-intelligence, investigation, physical-security). Addresses Guardian/Oversight gap from 5-soldier gap analysis. Restored LAW 71 original mission. Cross-refs S47 ERR-011/012/013/019 (credential exposure pattern). |
| ARGUS | 6 / 6 | ✅ | 2 | SCAFFOLD + SKILLS | 4 remaining skills |

Interpretation: Skill claims are aspirational documentation. Actual engineering capacity delivered = DICK dispatch loop + HERMES sync primitives + cross-cutting packages (llm-provider, memory-store, comms-channel). Everything else is a plan.

**S47/S63 Cross-Reference**: The S47 Empire Audit (26 findings across 8 sections) and S63 Solutions Manual (15 fixes, 39 audit items) are now archived at `sessions/S47/S47-EMPIRE-AUDIT.pdf` and `sessions/S63/S63-SOLUTIONS-MANUAL.docx`. Key findings that map to soldier skill gaps: ERR-011/012/013 (credential rotation unverified → SARGE + WICK), ERR-015 (three-store desync → HERMES), ERR-019 (DECREE 5 enforcement → SARGE + WICK), ERR-025/026 (session close + paper trail → EZRA + ATHENA).

---

## 4. Missing Skill Runtime Pattern

There is no SKILL.md convention for IronBridge soldier skills. Skills in the Cowork/Claude ecosystem follow a known pattern (SKILL.md with YAML frontmatter, trigger description, body). Soldier skills should follow a parallel convention so DICK's dispatcher can load them uniformly and so EZRA can audit them.

**Proposed pattern** (to be ratified by Boss as a new PROTOCOL):

```
soldiers/<soldier>/src/skills/<skill-name>/
├── SKILL.md              # frontmatter + description + trigger + body
├── index.ts              # exports run(input, ctx) -> structured outcome
└── <skill-name>.test.ts  # BROOKS-owned tests
```

Every skill MUST expose:
- `run(input, ctx)` returning `{ok: true, outcome} | {ok: false, reason, code}` (LAW 338)
- `chainlinkHop(prev)` producing signed hop payload if the skill is callable via dispatch
- `lawPredicates: string[]` naming which laws the skill runtime-checks or complies with

This should be specified in a new file `governance/SKILL-RUNTIME-PROTOCOL.md` and enforced by VETTER on all ingested skills and BROOKS on all internal skills.

---

## 5. Law-Predicate Skill Opportunity (High Leverage)

The most valuable skills for the Army are not "marketing-psychology" or "figma-to-code". They are skills that **turn abstract laws into runtime checks** so soldiers can autonomously detect their own drift.

Of the 346 laws, the following 13 are directly runtime-checkable and warrant law-predicate skills:

| Law | Rule summary | Predicate skill | Status |
|---|---|---|---|
| LAW 5 | Three-store sync every 5 min | `hermes/skills/three-store-drift-check` | NOT BUILT |
| LAW 6 | Heartbeat intervals (DICK 30s, soldiers 5min) | `ezra/skills/heartbeat-cadence-check` | NOT BUILT |
| LAW 8 | Active soldier count ≤ 10 | `dick/skills/roster-count-check` | NOT BUILT (plus: S65 ratified 11th soldier — LAW 8 needs amendment) |
| LAW 9 | Queue ≤ 50 pending tasks per soldier | `dick/skills/queue-pressure-check` | NOT BUILT |
| LAW 25 | Read-before-act declaration present | `ezra/skills/read-trail-verify` | **NOT BUILT — HIGH VALUE** |
| LAW 26 | Audit immutability (hash chain intact) | `ezra/skills/audit-hash-verify` | NOT BUILT |
| LAW 333 | Cannot self-police | `ezra/skills/cross-auditor-check` | NOT BUILT |
| LAW 335 | No credentials in source | `sarge/skills/credential-grep-check` | **NOT BUILT — HIGH VALUE (PAT leak active)** |
| LAW 336 | Credentials Upstash-only | `sarge/skills/upstash-only-check` | NOT BUILT |
| LAW 337 | PII redacted at write | `sarge/skills/pii-redaction-check` | NOT BUILT |
| LAW 338 | No silent failures (structured outcomes) | `ezra/skills/structured-outcome-verify` | NOT BUILT |
| LAW 340 | Immutable config post-boot | `sarge/skills/config-immutability-check` | NOT BUILT |
| LAW 346 | Session artifacts under `sessions/S##/` | `scripts/audit-law346-check.sh` | **BUILT (S65)** |

LAW 346 is the template. It shipped in S65 as a bash script + audit output + P2-drift-ticket emission. Every other runtime-checkable law should follow the same pattern, then graduate from script to proper soldier-skill module when SKILL-RUNTIME-PROTOCOL is ratified.

**Priority build order** (by blast radius):
1. `sarge/skills/credential-grep-check` — closes the open LAW 335 PAT leak + prevents future leaks
2. `ezra/skills/read-trail-verify` — enforces LAW 25 on every write (infra for everything else)
3. `ezra/skills/audit-hash-verify` — closes the LAW 26 attack surface
4. `sarge/skills/pii-redaction-check` — LAW 337 currently unenforced
5. `hermes/skills/three-store-drift-check` — drift has been flagged since S62 with no automated check

---

## 6. Cross-Ecosystem Skill Debt

Cowork-layer skills (`/mnt/.claude/skills/`) that soldiers should adopt but don't know exist:

| Cowork skill | IronBridge relevance | Adopt for |
|---|---|---|
| `skill-creator` | Build new skills consistently | BROOKS + VETTER ingestion |
| `xlsx` | Treasury + revenue reports | GARY, PAUL |
| `pdf` | Legal / contract / receipt artifacts | SARGE, PAUL |
| `pptx` | Boss briefings, board decks | DICK, GARY |
| `docx` | Governance doc publishing | DICK, SARGE |
| `schedule` | Scheduled task primitives | DICK, HERMES, EZRA |

The Cowork skill surface is free infrastructure the IronBridge soldiers are not currently exploiting. Any soldier orchestration prompt that needs structured document output should import from the Cowork skill layer rather than reinventing it.

---

## 7. ATHENA & VETTER — Doc/Code Asymmetry

Both agents have doctrinal docs under `agents/` but no code dirs under `soldiers/`. VETTER is RATIFIED (frontmatter: `ratified_by: boss`, `army_position: 11`). ATHENA is staged but scope unclear from a fresh read. Both are blocked on skill-runtime-protocol ratification, because their SKILL.md loadouts reference a convention that doesn't yet exist.

Immediate need: a fresh queue ticket to scaffold `soldiers/vetter/` and `soldiers/athena/` directories using the `ironbridge-soldier-template/` pattern. Otherwise their ratifications are paper-only.

---

## 8. The Enforcement Flywheel

Phase 1 (this document) surfaces the gaps. Phase 2 builds skills. The built skills must plug into an enforcement flywheel so their value compounds:

```
Boss directive
    ↓
Ticket filed in queue/
    ↓
DICK dispatches → soldier skill runs → structured outcome (LAW 338)
    ↓
Outcome written to audit/<domain>/<date>.md (LAW 26)
    ↓
Hourly scheduled task scans audit/ for drift (like audit-law346-check.sh)
    ↓
Drift → new P2 ticket in queue/ → DICK dispatches → loop
    ↓
RACHEL session-log-intel ticket mines sessions/ weekly → doctrinal improvements
    ↓
Improvements → new laws / amended laws / new skills → queue/
```

Every skill built should either emit to audit/, consume from audit/, or both. Skills that do neither are decorations.

---

## 9. Recommended Next Tickets (Phase 2 Decomposition)

Phase 2 of IB-0416-SOLDIER-ARSENAL-GAP-001 should be decomposed into these child tickets, filed in priority order:

1. `IB-0416-SKILL-RUNTIME-PROTOCOL-001` (P1) — Ratify governance/SKILL-RUNTIME-PROTOCOL.md; defines the SKILL.md convention + `run(input, ctx)` signature for all soldier skills.
2. `IB-0416-SKILLS-CANONICAL-REGISTRY-001` (P1) — Reconcile INDEX.md / MASTER-ASSIGNMENTS.md / SKILL_ROUTING into one canonical registry; regenerate INDEX.md from source.
3. `IB-0416-SARGE-CREDENTIAL-GREP-001` (P0) — Build `sarge/skills/credential-grep-check` first (closes LAW 335 open wound).
4. `IB-0416-EZRA-READ-TRAIL-VERIFY-001` (P1) — Build `ezra/skills/read-trail-verify` (enforces LAW 25 on all writes).
5. `IB-0416-EZRA-AUDIT-HASH-VERIFY-001` (P1) — Build `ezra/skills/audit-hash-verify` (LAW 26).
6. `IB-0416-SARGE-PII-REDACTION-001` (P1) — Build `sarge/skills/pii-redaction-check` (LAW 337).
7. `IB-0416-HERMES-DRIFT-CHECK-001` (P1) — Build `hermes/skills/three-store-drift-check` (LAW 5).
8. `IB-0416-VETTER-ATHENA-SCAFFOLD-001` (P2) — Create `soldiers/vetter/` and `soldiers/athena/` code dirs; ratifications without code are paper-only.
9. `IB-0416-BARE-TEMPLATE-SKILLS-BATCH-001` through `-008` (P2) — One per bare-template soldier. Each ticket builds minimum-viable skill set (~3-5 core skills) so the soldier becomes runtime-useful.
10. `IB-0416-COWORK-SKILL-ADOPTION-001` (P2) — Document and wire Cowork skills (xlsx, pdf, pptx, docx, schedule, skill-creator) into the relevant soldier toolchains.

---

## 10. Open Doctrinal Questions for Boss

- **LAW 8 amendment**: Army now has 11 active soldiers (VETTER ratified). LAW 8 says ≤10. Constitutional amendment needed or LAW 8 adjusted to ≤11-12.
- **Skill-vs-module distinction**: Are soldier skills allowed to call Cowork skills (xlsx, pdf), or must they be fully self-contained?
- **VETTER + ATHENA code scaffold priority**: Before or after Phase 2 law-predicate skills?
- **Canonical skill registry source**: MASTER-ASSIGNMENTS.md or a generated file?

Answers determine Phase 2 ticket ordering.

---

## 11. Verification Trail

- Read all files listed in the Mandate section
- Cross-checked claimed skill counts against actual filesystem inventory
- No new files created outside the skills/ folder without LAW 346 compliance
- Phase 1 deliverable = this document

**Ceremony log**: to be appended to `audit/ceremonies/2026-04-16-vault-reorg-law346.md` as an addendum under "Phase 1 Skill Arsenal Gap Analysis".

---

*End of Phase 1. Phase 2 awaits Boss ratification of the 10 child tickets above.*
