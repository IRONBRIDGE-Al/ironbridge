---
tags: [governance, doctrine, master-op-command, moc]
status: RATIFIED
ratified_by: boss
ratification_event: S65 directive "go" on pending-item list
ratification_date: 2026-04-16
supersedes: none
canonical_source: sessions/S58/S58-FINAL-OPERATIONAL-MASTER-PLAN.md
version: MOC-1.0
---

# MASTER OPERATIONAL COMMAND (MOC)

> **Purpose**: Canonical strategic doctrine for IronBridge. The single document every Claude session, every soldier, every Boss directive must align to.
> **Invocation**: When Boss says "master op command" or "msster op command", this is the doctrine being invoked.
> **Authority**: Governance tier 2 (below Constitution + Decrees, above Protocols). See [[CONSTITUTION]], [[DECREES]], [[PROTOCOLS-INDEX]].

---

## 1. What This Is

The Master Operational Command is IronBridge's strategic doctrine — the answer to "how do we actually run this army." It sits above Protocols (which are implementation details) and below the Constitution + Decrees (which are fundamental rules).

The canonical source of the MOC is `sessions/S58/S58-FINAL-OPERATIONAL-MASTER-PLAN.md` (876 lines). That file was LAW 25 compliant at generation, iterated through three revisions (S58 → S58.2 → S58.3), and represents the first complete strategic synthesis of IronBridge's operational intent.

This governance file is the canonicalization layer. It names S58 FINAL as the MOC, preserves its structure as an outline, and overlays current-state status so soldiers and sessions can use it as orientation without re-reading 876 lines.

**Rule of use**: Every session startup prompt should cite the MOC by title. Every soldier skill should declare which MOC section it serves. Every ticket should name the MOC part it advances.

---

## 2. The Eleven Parts (with Current Status)

The MOC is organized into 11 parts plus a Cross-Cutting Foundation. Below is each part, its canonical anchor in S58 FINAL, and its current implementation status (as of 2026-04-16).

### Cross-Cutting Foundation (S58 FINAL §17-146)

Seven foundational upgrades that apply to ALL soldiers and ALL platforms.

| # | Upgrade | Status | Notes |
|---|---|---|---|
| 1 | Root-of-Trust Bootstrap (master.key) | PARTIAL | master.key exists on Hetzner; Shamir shares + quarterly rotation not yet operational |
| 2 | Memory Resilience Protocol (LAW 345) | RATIFIED | LAW 345 in LAWS-INDEX; three-store sync still drifting — see queue/IB-0416-VAULT-SYNC-CHECK-FAILED.yml |
| 3 | Zero-Trust Runtime (Decree 8 provisional) | PARTIAL | Soldier template enforces TS + lockfile; not all soldiers containerized |
| 4 | Inter-Soldier Message Authentication (HMAC) | IMPLEMENTED | CHAINLINK protocol; see protocols/ |
| 5 | Hetzner Hardening | PARTIAL | SSH still password-auth per audit/violations/OPEN.md |
| 6 | Upstash Security Lockdown (per-soldier ACLs) | P1 OPEN | Violation tracked since S61 |
| 7 | Degraded Local Mode (SQLite fallback) | NOT STARTED | Blocks DR readiness |

### PART 1 — Infrastructure Map (§148-295)

What platforms IronBridge uses, who owns each, how they connect. COMPUTE / MEMORY / LLM / COMMUNICATION / INTELLIGENCE / HOSTING / FUTURE.

**Status**: DOCUMENTED, live. Subject to `integrations/INDEX.md` for operational state. Bankr LLM Gateway integration added S62 (not in S58).

### PART 2 — The Army (§297-425)

Command structure, soldier profiles, universal boot sequence, idle work priority queue.

**Status**: 16 soldiers ratified (S67, COFFEY added). 3 with custom code (DICK, HERMES, COFFEY), 9 with runnable skills (SARGE: 11, RACHEL: 3, EZRA: 3, DICK: 2, HERMES: 2, COFFEY: 2, ARGUS: 2, RIPLEY: 2, VETTER: 2 = 29 total, verified against disk S69), 7 bare templates. SRP-1.0 skill runtime ratified. S69 added platform-health-monitor + credential-write-hook + verified disk counts. claude-mem integration planned (four-store architecture).

### PART 3 — Job Lifecycle (§427-477)

How tasks flow: Boss → DICK → soldier → audit. Mission-assignment → heartbeat → execute → report.

**Status**: DICK dispatch loop operational with execution bridge wired to skill-executor (S66). Full claim→execute→audit cycle testable. S66 added auto-ingest pipeline: session-ingest scans session dirs → generates tickets → dispatches to army. git-log-router categorizes all commits and routes to owning soldiers. doc-tracker monitors vault changes and broadcasts notifications. The intake funnel from session work to army dispatch is now coded.

### PART 4 — Communication Matrix (§479-507)

Who talks to whom. Escalation protocol. DECREE 2 (DICK is gatekeeper) enforced.

**Status**: IMPLEMENTED in code. Audit trail: DICK index.ts + CHAINLINK signHop/verifyHop primitives.

### PART 5 — Disaster Recovery (§509-552)

RTO/RPO by soldier type, data recovery path, outage scenarios (Hetzner total loss, Upstash outage).

**Status**: DOCUMENTED only. No DR drill has been run. SQLite fallback not implemented.

### PART 6 — Observability (§554-578)

Structured logging, dashboard (S61+), alerting.

**Status**: PARTIAL → PROGRESSING. Discord alert routing exists (reporting/discord-alerts.md). Dashboard not built. S66: doc-tracker (SARGE) + git-log-router (DICK) provide structured change detection and commit categorization — foundational data feeds for observability. claude-mem integration planned to add session observation search.

### PART 7 — Security & Privacy Architecture (§580-617)

Priority order (immutable), security layers, what each soldier must never do.

**Status**: DOCTRINE RATIFIED (LAWs 335/336/337 + Decrees). PAT removed from local .git/config files (S66). Claude GitHub Action replaces PAT auth. Boss must still revoke old PAT on github.com.

### PART 8 — Accountability & Rewards (§619-663)

KPIs per soldier, recognition system, violation tracking.

**Status**: Violation tracking live (audit/violations/OPEN.md). KPI scoreboards not yet built.

### PART 9 — BNKR & Revenue Pipeline (§665-718)

Why BNKR matters, the pipeline, skill categories, distribution, scraping safety.

**Status**: Bankr LLM Gateway LIVE (20 BNKR loaded). Skills/distribution pipeline partial. VETTER bankr-watch module ratified for always-on opportunity scanning.

### PART 10 — Deployment Order S59-S63 (§720-807)

Sequenced rollout: S59 security+bootstrap → S60 memory+code → S61 infra+QA → S62 intel+growth → S63 product+frontend.

**Status**: Largely complete through S63. S64-S65 extended the plan with governance hardening (LAWs 333-346) + VETTER ratification + vault reorg. Original S58 plan did not anticipate S64+.

### PART 11 — The Oath (§809-830)

Every soldier swears to this on boot.

**Status**: DOCTRINE. Should be embedded in every soldier's boot sequence as a runtime assertion — not currently enforced in code. Candidate for `ironbridge-soldier-template/src/core/oath.ts`.

---

## 3. What's Changed Since S58 FINAL

The S58 FINAL plan was generated 2026-04-14. Since then, the following material changes have been ratified and are binding in addition to (not replacing) the MOC:

- **LAWs 333-346** (14 new laws) added in S63-S65
- **DECREE 8** promoted from provisional to RATIFIED (see [[DECREES]])
- **VETTER** ratified as 11th soldier (LAW 8 count amendment pending)
- **ATHENA** staged (no code yet)
- **LAW 346 Session Artifact Location** — new vault hygiene law (S65, this session)
- **Vault reorg** — 34 session-tagged files moved to `sessions/S##/` per LAW 346
- **Bankr LLM Gateway** — full operational integration (S62)
- **CHAINLINK protocol** — hop signature + verification primitives codified
- **Session-to-Army Pipeline (S66)** — session-ingest + git-log-router + doc-tracker skills close the intake funnel gap. Session artifacts now auto-categorize and dispatch as tickets.
- **claude-mem Integration Plan (S66)** — Four-store architecture proposed: Session (local SQLite) → Hot (Upstash) → Warm (HERMES) → Cold (GitHub Gists). LAW 345/LAW 5 amendments pending.
- **GitHub Ops Automation (S66)** — github-ops + credential-rotation skills replace manual PAT/secret management. SARGE can now audit tokens, push secrets, verify integration, track rotation compliance via code.

These deltas are authoritative. When MOC text contradicts a later ratified law/decree, the later artifact wins. Sessions must read both the MOC and `governance/LAWS-INDEX.md` + `governance/DECREES.md` to reconcile.

---

## 4. How to Invoke the MOC

**In a session startup prompt**:
> "Read governance/MASTER-OP-COMMAND.md and the S58 FINAL source. Your actions must align to MOC Part N (section reference). Check LAWS-INDEX + DECREES for post-S58 deltas."

**In a queue ticket**:
```yaml
moc_alignment: "Part 2 (Army) + Part 9 (BNKR revenue)"
```

**In a soldier skill**:
```typescript
// MOC-alignment: Part 7 Security + LAW 337 PII redaction
```

Every state-changing action should be traceable to an MOC part. Actions that don't align require explicit justification in the ceremony log.

---

## 5. Open Doctrinal Drift

Items the MOC says but current reality contradicts. These are tracked for resolution:

| MOC claim | Current reality | Owner |
|---|---|---|
| "Only ONE soldier deployed" (§11) | 2 deployed (DICK, HERMES) + 8 templates + VETTER ratified | n/a — outdated prose, updated above |
| "101 skills across 10 soldiers" (§11) | 29 runnable skill modules across 9 soldiers (SARGE: 11, RACHEL: 3, EZRA: 3, DICK: 2, HERMES: 2, COFFEY: 2, ARGUS: 2, RIPLEY: 2, VETTER: 2); 16 soldiers total. S69 verified against disk. | `skills/GAP-ANALYSIS.md` tracks this |
| "344 laws (345 after this plan)" (§11) | 346 laws | LAWS-INDEX |
| "Three-store sync every 5 minutes" (§44) | Drift detected since S62, no automated remediation | HERMES / IB-0416-VAULT-SYNC-CHECK-FAILED (S66: three-store-drift-check skill built) |
| "SSH: Key-only auth" (§116) | Password auth still active | SARGE / audit/violations/OPEN.md P0 |

The list above is not exhaustive. A quarterly MOC-reality diff should be run by EZRA and filed as a ceremony log.

---

## 6. Maintenance Rules

- **Do not edit S58 FINAL source file** — it is an immutable session artifact per LAW 346. This canonicalization doc is where current-state overlays and deltas are maintained.
- **Version this file** — frontmatter `version:` bumps when the MOC is materially updated (new part added, part status changed). Minor reality-diff patches do not require version bump but must be noted in section 5.
- **Quarterly audit** — EZRA runs a part-by-part reality check and files ceremony log.
- **Promotion path** — future operational master plans (e.g., an "S80 FINAL") can supersede this only via constitutional amendment citing this file as predecessor.

---

## 7. Read-Before-Act References

When a session invokes the MOC, the reading order is:

1. `governance/MASTER-OP-COMMAND.md` (this file) — current-state overlay
2. `sessions/S58/S58-FINAL-OPERATIONAL-MASTER-PLAN.md` — canonical source (876L)
3. `governance/LAWS-INDEX.md` — deltas since S58 (LAWs 333-346)
4. `governance/DECREES.md` — decree-level overrides
5. `governance/CONSTITUTION.md` — fundamental rules
6. `skills/GAP-ANALYSIS.md` — where the arsenal actually stands

Items 1-3 are mandatory. 4-6 are read-as-relevant.

---

*End MOC-1.0. Next review: 2026-07-16 (quarterly).*
