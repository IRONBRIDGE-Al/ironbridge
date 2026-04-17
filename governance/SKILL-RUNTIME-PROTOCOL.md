---
tags: [governance, protocol, skills, runtime]
status: RATIFIED
ratified_by: boss
ratification_event: S66 directive "go" on gameplan
ratification_date: 2026-04-16
version: SRP-1.0
ticket: IB-0416-SKILL-RUNTIME-PROTOCOL-001
moc_alignment: "Part 2 (Army) + Part 3 (Job Lifecycle) + Part 8 (Accountability)"
---

# Skill Runtime Protocol (SRP-1.0)

> **Purpose**: Define what a "skill" is at runtime so DICK can dispatch, EZRA can audit, and BROOKS can test uniformly across all soldiers.
> **Authority**: Governance tier 3 (Protocol level — below Constitution/Decrees/MOC, above implementation)
> **Canonical source**: This file.

---

## 1. Problem Statement

IronBridge claims 168 skills across 14 soldiers. Zero exist as runnable code (GAP-ANALYSIS.md, S65). Skills are routing labels in DICK's `SKILL_ROUTING` map — strings that point to soldier IDs with no executable behind them.

This protocol defines what a skill must export, how DICK loads and calls it, how EZRA audits the result, and how BROOKS tests it.

---

## 2. Skill Directory Layout

Every skill lives under its owning soldier's code directory:

```
soldiers/<soldier>/src/skills/<skill-name>/
  SKILL.md            # Frontmatter + description + governance citations
  index.ts            # Exports: run, meta
  <skill-name>.test.ts  # BROOKS-owned test suite
```

**Naming**: `<skill-name>` is kebab-case, max 50 chars, must match the `id` field in `meta`.

---

## 3. Skill Module Exports

Every `index.ts` MUST export exactly two things:

```typescript
export const meta: SkillMeta = { ... };
export async function run(input: SkillInput, ctx: SkillContext): Promise<SkillOutcome> { ... }
```

### 3.1 SkillMeta

```typescript
interface SkillMeta {
  /** Kebab-case unique identifier, matches directory name */
  readonly id: string;

  /** Human-readable name */
  readonly name: string;

  /** Owning soldier ID (lowercase) */
  readonly soldier: string;

  /** Which laws this skill runtime-checks or complies with */
  readonly lawPredicates: readonly string[];

  /** Which MOC parts this skill serves */
  readonly mocAlignment: readonly string[];

  /** Minimum reputation tier required to dispatch this skill */
  readonly minTier: 'GOLD' | 'SILVER' | 'BRONZE' | 'PROBATIONARY';

  /** Blast radius declaration (required by Verification Harness S63 section 2) */
  readonly blastRadius: string;

  /** Is the effect reversible? */
  readonly reversible: boolean;
}
```

### 3.2 SkillInput

```typescript
interface SkillInput {
  /** Ticket ID that triggered this skill execution */
  readonly ticket_id: string;

  /** Raw parameters from the ticket or dispatch call */
  readonly params: Readonly<Record<string, unknown>>;

  /** Paths to files this skill should read (LAW 25: declared upfront) */
  readonly readTargets: readonly string[];
}
```

### 3.3 SkillContext

```typescript
interface SkillContext {
  /** Soldier ID running this skill */
  readonly soldier_id: string;

  /** HMAC signing key for CHAINLINK hops */
  readonly hmac_key: string;

  /** Clock function (injectable for tests) */
  readonly now: () => Date;

  /** Logger */
  readonly logger: {
    info(msg: string, fields?: Record<string, unknown>): void;
    warn(msg: string, fields?: Record<string, unknown>): void;
    error(msg: string, fields?: Record<string, unknown>): void;
  };

  /** Read a file and return its content + SHA256 hash (LAW 25 trail) */
  readonly readWithTrail: (path: string) => Promise<{
    content: string;
    sha256: string;
    timestamp: string;
  }>;
}
```

### 3.4 SkillOutcome

```typescript
type SkillOutcome =
  | { readonly ok: true; readonly outcome: string; readonly artifacts: readonly string[]; readonly readTrail: readonly ReadTrailEntry[] }
  | { readonly ok: false; readonly reason: string; readonly code: SkillFailCode; readonly readTrail: readonly ReadTrailEntry[] };

type SkillFailCode =
  | 'input_invalid'
  | 'read_failed'
  | 'governance_violation'
  | 'runtime_error'
  | 'dependency_missing'
  | 'timeout';

interface ReadTrailEntry {
  readonly source: string;
  readonly sha256: string;
  readonly timestamp: string;
  readonly soldier_id: string;
  readonly purpose: string;
}
```

**LAW 338 compliance**: Every skill MUST return a structured outcome. Throwing is forbidden — catch internally and return `{ok: false, ...}`.

**LAW 25 compliance**: Every file read during execution MUST appear in `readTrail`. The `readWithTrail` context helper enforces this.

---

## 4. DICK Dispatch Integration

When DICK's dispatch loop claims a ticket and identifies the target soldier + skill:

1. DICK resolves the skill module: `soldiers/<owner>/src/skills/<skill-name>/index.ts`
2. DICK validates `meta.minTier` against the soldier's current reputation tier
3. DICK constructs `SkillInput` from the ticket's YAML fields
4. DICK constructs `SkillContext` with the soldier's signing key and a `readWithTrail` that logs every read
5. DICK calls `run(input, ctx)` with a timeout (default: 30s for P0-P1, 120s for P2-P4)
6. DICK captures the `SkillOutcome`
7. On `{ok: true}`: DICK signs a CLAIM hop with `payload_sha256 = SHA256(JSON.stringify(outcome))`
8. On `{ok: false}`: DICK logs the failure per LAW 338, requeues or quarantines per severity

The `executeSkill` function lives in `soldiers/dick/src/dispatch/skill-executor.ts`.

---

## 5. EZRA Audit Integration

After DICK signs the CLAIM hop, EZRA audits:

1. Verify the `readTrail` in the outcome — every entry must reference a real file with matching SHA256
2. Verify `lawPredicates` — if the skill claims to check LAW N, the outcome must include evidence
3. Verify `blastRadius` — the outcome's `artifacts` must not exceed declared blast radius
4. Sign an AUDIT hop if passed; reject with structured reason if failed

---

## 6. BROOKS Test Convention

Every skill MUST have a `<skill-name>.test.ts` that:

1. Tests the happy path with valid input → `{ok: true, ...}`
2. Tests at least one failure mode → `{ok: false, ...}` with correct `code`
3. Verifies `readTrail` is populated (LAW 25)
4. Verifies no throws escape (LAW 338)
5. Uses injected clock and mock `readWithTrail` (no real filesystem in tests)

Test runner: `npx vitest` (already in soldier template devDependencies).

---

## 7. Skill Registry

The canonical skill registry is auto-generated from the filesystem:

```bash
find soldiers/*/src/skills/*/SKILL.md -exec grep -l "^id:" {} \;
```

`skills/INDEX.md` is regenerated (not hand-edited) from this scan. The scan runs as part of the LAW 346 hourly check.

---

## 8. Migration Path for Existing Skills

Skills currently exist only as routing labels. Migration:

1. Pick a routing label from DICK's `SKILL_ROUTING` map
2. Create the directory structure under the owning soldier
3. Implement `run()` + `meta` per this protocol
4. Add test file
5. The label in `SKILL_ROUTING` is kept for backward compatibility but now points to a real module

Priority: Law-predicate skills first (GAP-ANALYSIS.md section 5), then domain skills.

---

*End SRP-1.0. Next review: when GAP-ANALYSIS Phase 2 tickets ship.*
