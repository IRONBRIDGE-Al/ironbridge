---
tags: [governance, doctrine, routing, claude-cowork, claude-code, soldier-runtime, fischer]
status: RATIFIED S66 — authored from Boss's Fischer-Level Recommendations message
version: FRD-1.0
ratified_by: boss
ratification_date: 2026-04-16
---

# FISCHER ROUTING DOCTRINE (FRD-1.0)

Boss's S66 message codified the IronBridge multi-agent routing pattern. This doctrine is that message, elevated to governance tier, with implementation hooks.

## 1. The pattern (Boss, verbatim, 2026-04-16)

> Never let Claude Cowork/Code execute `git push`, network calls to Bankr, or sensitive actions directly (sandbox issues + security risk).
>
> Best pattern: **Claude → outputs diffs / structured JSON / commands → your Hetzner soldier runtime (DICK/RIPLEY) executes with SARGE audit + verification-before-completion.**
>
> Use git worktrees heavily so Claude sessions don't step on each other.

## 2. Role definitions

| Layer | Who | What they do | What they MUST NOT do |
|---|---|---|---|
| **L1 — Intent** | Boss (human) or external trigger (Discord, voice, email) | Issues commands, ratifies, reviews | — |
| **L2 — Translator** | Command Deck (Cowork) OR Claude Code (CLI) | Translates Boss intent into structured JSON/diffs/commands | Execute sensitive actions (push, pay, deploy, publish) |
| **L3 — Dispatcher** | DICK | Receives structured input, routes to the right soldier, enforces LAW 9 + LAW 191 | Execute skills itself |
| **L4 — Auditor-pre** | EZRA | Pre-flight `auditClaim` on every ticket; CHAINLINK signatures | Execute or dispatch |
| **L5 — Executor** | Soldier skill (SARGE, HERMES, BROOKS, …) | Performs the state change; emits structured outcome | Dispatch |
| **L6 — Auditor-post** | ARGUS (Empire Auditor) | Independent cold-log verification, LAW 333 | Execute or dispatch |
| **L7 — Deployer** | RIPLEY | Final deploy gate; builds → tests → pushes | Accept unsigned input |

**The routing invariant**: L2 NEVER talks to L5 directly. L2 ships structured output to L3; L3 routes after L4 clears it; L5 executes; L6 audits; L7 deploys if applicable.

## 3. The structured-output schema (what L2 gives L3)

Claude Cowork / Claude Code writes dispatch envelopes in this exact shape to `queue/` or to `ironbridge:dispatch:inbox`:

```yaml
---
dispatch_id: DISP-<session>-<ts>-<n>
issuer: cowork:command-deck  |  cowork:<plugin>  |  code:<session>
soldier: sarge | hermes | brooks | ...
skill: <skill-name matching SRP-1.0 registry>
params:
  <skill-specific>
law_predicates: [LAW-25, ...]
blast_radius: <one-line>
reversible: true | false
expected_outcome: <one-line>
read_trail:
  - source: <path|uri>
    sha256: <hex>
    timestamp: <iso>
signing_required: true
---
(body — free-form reasoning, markdown ok)
```

L3 (DICK) validates, signs with CHAINLINK, assigns to L5. L5 executes with L4-checked input. L6 audits the outcome. L7 deploys if the skill produced deployable artifacts.

## 4. What Claude Cowork / Claude Code MAY do directly

- Read (any source they have access to)
- Emit structured dispatch envelopes (the YAML above)
- Emit ceremony log drafts (Command Deck scribes; EZRA countersigns)
- Mutate memory/ (ASM-1.0 Cold store) — append-only
- Mutate outputs/ (presentation to Boss)
- Mutate governance docs IF explicitly authorized by Boss in-chat

## 5. What Claude Cowork / Claude Code MUST NOT do directly

- `git push` to any remote (deploy = RIPLEY)
- External payments / Bankr calls (revenue = VETTER + treasury soldier)
- Discord/Telegram/SMS sends (external comms = DICK per DECREE 2)
- Install GitHub Apps or accept OAuth grants (Boss-only)
- Modify soldier `src/` without DICK dispatch (skill build = BROOKS)

## 6. Git worktree hygiene (per Boss's recommendation)

When Claude Cowork or Claude Code operates on soldier repos, each session uses its own `git worktree` so parallel sessions don't conflict:

```bash
# At session start
cd /home/ironbridge/soldiers/<repo>
git worktree add ../<repo>-<session-id> main
cd ../<repo>-<session-id>

# At session close
cd /home/ironbridge/soldiers/<repo>
git worktree remove ../<repo>-<session-id>
```

RIPLEY's deploy gate merges approved worktree branches into `main` after EZRA countersign.

## 7. Claude in Cowork — permission surfaces (narrow scope)

Per Boss's message, Cowork sessions get access to ONE bounded folder per task:

- **Inbox Dispatcher session** → `~/brain/inbox/` only (Obsidian inbox)
- **Deck Co-Pilot session** → `command-inbox/` folder only
- **Skill Architect session** → `ironbridge-skills/` repo only (git worktree)
- **GameHub session** → a tenant namespace only
- **Empire Auditor session** → read-only across everything, write-only to `improvements/`

The Cowork mount is the enforcement boundary. Command Deck must not request folders outside its task scope.

## 8. Implementation tickets (filed S66/S67)

- `IB-0417-INBOX-DISPATCHER-001` — Boss's Feature #1 (autonomous inbox dispatcher)
- `IB-0417-DECK-COPILOT-001` — Boss's Feature #2 (voice-command translator)
- `IB-0417-SKILL-ARCHITECT-001` — Boss's Feature #3 (skill generator)
- `IB-0417-GAMEHUB-VISION-001` — Boss's Feature #4 (game screen analysis)
- `IB-0417-EMPIRE-AUDITOR-RETRO-001` — Boss's Feature #5 (self-healing / retrospective)

Each ticket has an explicit `routing_enforcement: FRD-1.0` field and MUST follow the L1–L7 flow above.

## 9. The FRD-1.0 smell test

When Claude (any variant) is about to take an action, ask:
1. Is this a READ or a WRITE?
2. If WRITE: is it into my own output buffer, a memory/ JSONL, or a structured dispatch envelope? (Fine.) Or is it a state change in another soldier's namespace, the file system, Upstash, or the network? (Route it through DICK.)
3. If this action has a reversibility of `false`, did Boss say "go" in chat for this specific action?

If uncertain, stop and emit a dispatch envelope instead.

---

*End of FRD-1.0. Enforced by EZRA and ARGUS; compliance audited on every ceremony log.*
