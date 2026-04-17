# The 345 Laws of IronBridge

**Ratified By**: S58 Master Plan  
**Authority**: Constitutional Amendment Only  
**Status**: Immutable (LAW 106)  
**Last Updated**: 2026-04-15

---

## Introduction

These 345 laws define the operational, security, and governance rules that IronBridge Soldiers and systems must follow. Laws are immutable once ratified and can only be superseded by subsequent constitutional amendments.

**Note**: Deprecated ghost soldier laws (59-66, 71-74) are preserved in history but no longer enforced. See [[#Deprecated Ghost Soldier Laws|Deprecated Section]].

---

## Core Architecture Laws (LAW 1-30)

### LAW 1: Three-Store Persistence
The system maintains three synchronized data stores: Hot (Redis, 60s TTL), Warm (HERMES proxy, 5min), Cold (GitHub Gists, permanent).

**Related**: [[CONSTITUTION#Persistence|Constitution: Persistence]], [[PROTOCOLS-INDEX#Sync Protocol|Sync Protocol]]

---

### LAW 2: Soldier Lifecycle
All Soldiers follow: `INIT` → `BOOT` → `HEARTBEAT` → `READY` → `EXECUTE` → `REPORT` → `SLEEP` → `HEARTBEAT`

---

### LAW 3: Memory Decay
Operational memory (non-audit) degrades after 72 hours without refresh. Audit trail (SHA trail) persists indefinitely.

**Related**: [[#LAW 345|LAW 345: Memory Resilience & Decay]]

---

### LAW 4: Graceful Degradation
If any critical component fails, fall back to next-best alternative. Escalate via circuit breaker (LAW 191).

---

### LAW 5: Three-Store Sync
Hot → Warm → Cold synchronization occurs every 5 minutes. Conflict resolution: **timestamp wins** (last-write-wins).

**Sync Sequence**:
1. Write to Hot (Redis): 60s TTL
2. Mirror to Warm (HERMES): 5min cache
3. Archive to Cold (GitHub): permanent

**Related**: [[PROTOCOLS-INDEX#Sync Protocol|Sync Protocol]]

---

### LAW 6: Heartbeat Interval
- **DICK**: Every 30 seconds
- **Soldiers**: Every 5 minutes
- All heartbeats must include HMAC signature (DECREE 8)

**Related**: [[PROTOCOLS-INDEX#Heartbeat Protocol|Heartbeat Protocol]]

---

### LAW 7: Circuit Breaker Threshold
Three consecutive failures → fallback. Fourth failure → escalate to SARGE.

**Related**: [[#LAW 191|LAW 191: Circuit Breaker Pattern]]

---

### LAW 8: Soldier Count
Active Soldiers never exceed 10 concurrent. Resource constraints per Hetzner allocation.

---

### LAW 9: Task Queue Limit
Maximum 50 pending tasks per Soldier. Excess tasks trigger DICK rate limiting.

---

### LAW 10: Execution Timeout
Tasks timeout after 30 minutes. Soldiers escalate to SARGE if timeout detected.

---

### LAW 11-19: Reserved (Future Use)

---

### LAW 20: THANOS Standard

Before any major decision:

1. **What is the best way to do this?** (Technical excellence)
2. **What am I missing?** (Risk assessment)
3. **Does this serve the mission?** (Strategic alignment)

**Application**: Architecture reviews, protocol changes, deployments.

**Related**: [[CONSTITUTION#THANOS Standard|Constitution: THANOS Standard]]

---

### LAW 21-24: Reserved (Future Use)

---

### LAW 25: Read Before Act - Declaration & SHA Trail

**Rule**: Every Soldier must declare what data it read before taking action.

**Requirements**:
- Log source and content hash (SHA-256)
- Timestamp of read
- Soldier identifier
- Purpose statement
- Store in audit trail (Cold layer)

**Format**:
```
READ_EVENT:
  timestamp: 2026-04-15T14:32:01Z
  soldier_id: Soldier-Alpha
  source: github.com/ironbridge/config
  content_hash: sha256:a3f5b8d9...
  purpose: Validate deployment checklist
```

**Enforcement**: Mandatory before all state-changing operations.

**Related**: [[CONSTITUTION#Accountability|Constitution: Accountability]], [[PROTOCOLS-INDEX#Boot Protocol|Boot Protocol Step 3]]

---

### LAW 26: Immutability of Audit Trail
Audit logs cannot be deleted, modified, or redacted. Only appended to. Empire Auditor has read-only access.

**Related**: [[#LAW 106|LAW 106: Laws Are Immutable]], [[#LAW 333|LAW 333: Cannot Self-Police]]

---

### LAW 27: Cold Storage Format
All Cold layer data stored as GitHub Gists with metadata JSON header:
```json
{
  "vault": "ironbridge",
  "layer": "cold",
  "timestamp": "2026-04-15T14:32:01Z",
  "soldier_id": "Soldier-Alpha",
  "hash": "sha256:..."
}
```

---

### LAW 28: Warm Layer Encryption
HERMES JWT proxy encrypts all payloads in Warm layer using AES-256-GCM.

**Related**: [[DECREES#DECREE 6|DECREE 6: Obsidian Localhost:27124]]

---

### LAW 29: Hot Layer Volatility
Redis (Hot layer) accepts data loss up to 60 seconds. For PII-sensitive data, skip Hot layer entirely.

---

### LAW 30: Storage Validation
Before write to any layer, validate schema. Reject malformed data with error event (not silent failure).

---

## Command & Control Laws (LAW 31-60)

### LAW 31: Discord Primary Command Channel
Discord is the sole human-to-system command interface. All Boss directives route through Discord.

**Channel Structure**:
- `#commands`: Soldier task assignments
- `#escalations`: P0-P2 events
- `#heartbeats`: System status (bot-generated)
- `#archives`: Cold layer notifications

---

### LAW 32: DICK Discord Integration
DICK monitors Discord `#commands` channel every 30 seconds. Acknowledges valid commands within 30 seconds.

---

### LAW 33: Command Format
All commands follow JSON schema. Malformed commands rejected with error reply.

```json
{
  "type": "task_assign",
  "soldier_id": "Soldier-Alpha",
  "task_id": "task-uuid",
  "objective": "...",
  "deadline": "2026-04-16T00:00:00Z"
}
```

---

### LAW 34-60: Reserved (Future Use / Command Protocol Details)

---

## Deprecated Ghost Soldier Laws (LAW 59-66, LAW 71-74)

**Status**: DEPRECATED (superseded by improved design)

These laws defined early Soldier protocols and authentication schemes. Preserved for historical audit trail per LAW 26.

### LAW 59-66: Original Soldier Protocol
Original design: single-threaded sync agents. **Superseded by** improved multi-task architecture.

### LAW 71-74: Ghost Security Cluster (Personal Security Detail)

Original soldiers (all ghosted S39+, deprecated S58):

| LAW | Soldier | Original Role | S65 Status |
|---|---|---|---|
| 71 | **Wick** | Security Lead | **RESTORED** — Personal Security Lead (CHARTERED S65) |
| 72 | **Bourne** | Physical Security | Absorbed into Wick Module 3 (Physical Security Awareness) |
| 73 | **Holmes** | Investigation | Absorbed into Wick Module 2 (Investigation) |
| 74 | **Holmes** | Analysis | Absorbed into Wick Module 2 (pattern correlation + attribution) |

**S58 mischaracterization**: This section was previously labeled "Early Authentication (Pre-Upstash)" with soldier names stripped. The original design was a four-soldier personal security cluster for Boss — not an authentication scheme. Corrected S65 per Boss directive + LAW 25 evidence trail.

SARGE absorbed infrastructure security (zero-trust, ACL, credential rotation). Wick's personal security mission (threat intelligence, digital footprint, investigation) was orphaned from S39 through S65. Now restored.

**Archive Location**: See [[#Deprecated Laws Archive|Deprecated Laws Archive]] section below.

---

## Integration Laws (LAW 87-120)

### LAW 87: Discord Primary Command Channel
Discord is the primary command channel for human operators. All Boss directives route through Discord.

**Frequency**: DICK polls every 30 seconds.

**Related**: [[DECREES#DECREE 2|DECREE 2: DICK is Gatekeeper]]

---

### LAW 88: LLM Selection Hierarchy
- **Primary**: Groq (fastest inference, preferred for real-time tasks)
- **Secondary**: Gemini (fallback, broader capability)
- **Tertiary**: Claude (research, complex reasoning; rate-limited)

**Routing**: DICK selects based on task type and API availability.

---

### LAW 89: Groq Primary LLM
Groq inference used for:
- Real-time decision support
- Fast text summarization
- Quick code review (< 500 lines)

**API**: REST via `api.groq.com/openai/v1/chat/completions`

**Related**: [[#LAW 88|LAW 88: LLM Selection Hierarchy]]

---

### LAW 90: Gemini Secondary LLM
Gemini used for:
- Complex multimodal tasks (image analysis)
- Long-form content generation (reports, docs)
- Fallback when Groq unavailable

**API**: REST via Google Cloud AI

**Related**: [[#LAW 88|LAW 88: LLM Selection Hierarchy]]

---

### LAW 91: No Direct LLM Calls
Soldiers never call LLM APIs directly. Requests route through DICK for rate limiting and audit logging.

**Related**: [[DECREES#DECREE 2|DECREE 2: DICK is Gatekeeper]], [[DECREES#DECREE 7|DECREE 7: API > UI Always]]

---

### LAW 92-105: Reserved (Future Use)

---

### LAW 106: Laws Are Immutable

Once ratified by constitutional amendment, laws cannot be repealed. They can be:
- **Superseded** by new laws (marked as deprecated, preserved in archive)
- **Reinterpreted** via judicial review
- **Conditionally suspended** by Boss directive only (rare, requires S-series amendment)

**Immutable Examples**: LAW 5 (Three-Store Sync), LAW 106 (this law), LAW 333 (Cannot Self-Police)

**Deprecated Law Archive**: [[#Deprecated Ghost Soldier Laws|Ghost Soldier Laws]]

---

### LAW 107-117: Reserved (Future Use)

---

### LAW 118: Every Commit Checked for Secrets
Every Git commit (to any IronBridge repo) must pass secret scanning:
- No API keys, tokens, or credentials
- No PII (names, emails, addresses)
- Automated via pre-commit hook
- Violations block merge to main branch

**Tool**: `detect-secrets` + custom regex patterns

**Related**: [[DECREES#DECREE 5|DECREE 5: Rotate Credentials After Exposure]]

---

### LAW 119: RIPLEY Deploy Authority
Only RIPLEY can deploy Soldier code to production Hetzner instances.

**Related**: [[#LAW 121|LAW 121: RIPLEY Deploys Only]]

---

### LAW 120: Blue-Green Deployment
All production deployments use blue-green strategy. Rollback automatic on health check failure.

**Related**: [[PROTOCOLS-INDEX#Deploy Protocol|Deploy Protocol]]

---

## Deployment & Operations Laws (LAW 121-200)

### LAW 121: RIPLEY Deploys Only

**Rule**: Only RIPLEY (deployment automation) can push Soldier code to Hetzner.

**Process**:
1. Code merged to main branch (after secret scan)
2. RIPLEY triggered via GitHub Actions
3. Builds Docker image, tests in staging
4. Blue-green deploy to production
5. Health checks pass → traffic switches
6. Failure → auto-rollback

**Authority**: RIPLEY has exclusive SSH/Docker daemon access to Hetzner

**Related**: [[PROTOCOLS-INDEX#Deploy Protocol|Deploy Protocol]]

---

### LAW 122-168: Reserved (Future Use)

---

### LAW 169: GitHub API - Blob Pattern (Part 1)

For file operations on GitHub, use blob API (not Git Data API):

```
GET /repos/{owner}/{repo}/contents/{path}
Authorization: Bearer {token}
```

**Advantages**:
- Simpler rate limits
- Built-in base64 encoding/decoding
- Atomic operations

**Related**: [[#LAW 170|LAW 170: GitHub API - Blob Pattern (Part 2)]]

---

### LAW 170: GitHub API - Blob Pattern (Part 2)

For write operations:

```
PUT /repos/{owner}/{repo}/contents/{path}
{
  "message": "commit message",
  "content": "base64-encoded-content",
  "sha": "previous-blob-sha"
}
```

**Requirements**:
- Fetch current SHA before write
- Atomic compare-and-swap
- All writes trigger secret scan (LAW 118)

**Related**: [[#LAW 169|LAW 169: GitHub API - Blob Pattern (Part 1)]]

---

### LAW 171-190: Reserved (Future Use)

---

### LAW 191: Circuit Breaker - Three Strikes Pattern

**Rule**: Three consecutive failures on any operation trigger fallback mode.

**Implementation**:
1. Track consecutive failures per operation
2. After 3 failures: switch to fallback strategy
3. Log event with timestamp and error details
4. On success: reset counter to 0
5. Fourth consecutive failure: escalate P0 to SARGE

**Fallback Examples**:
- Upstash down → SQLite fallback → replay on recovery
- Groq unavailable → use Gemini
- DICK unavailable → Soldiers use cached configs

**Related**: [[DECREES#DECREE 2|DECREE 2: DICK is Gatekeeper]], [[PROTOCOLS-INDEX#Degraded Mode Protocol|Degraded Mode Protocol]]

---

### LAW 192-223: Reserved (Future Use)

---

### LAW 224: Daily Intel Brief Generation
Every 24 hours (UTC midnight), DICK generates and publishes a system intel brief:

**Brief Contents**:
- Uptime percentage
- Task completion rate
- API error summary
- Soldier resource utilization
- Escalation count (P0-P4)
- Memory health snapshot

**Distribution**: Posted to Discord `#heartbeats` channel

**Format**: JSON + human-readable markdown summary

---

### LAW 225-332: Reserved (Future Use)

---

## Audit & Safety Laws (LAW 333-345)

### LAW 333: Cannot Self-Police — Empire Auditor Exists

**Rule**: No system component can audit itself. Empire Auditor has exclusive read-only access to all logs.

**Empire Auditor Authority**:
- Read access to all audit trails (Cold layer)
- Independent review of escalations
- Authority to order investigations
- Cannot be overridden by THANOS or DICK
- Reports directly to Boss on findings

**Rationale**: Prevents insider threats, ensures accountability (CONSTITUTION Article I.2)

**Related**: [[CONSTITUTION#Accountability|Constitution: Accountability]]

---

### LAW 334: [RESERVED - Preserved for Future Amendment]

---

### LAW 335: Credential Storage Requirement
Credentials must never be stored in:
- Source code
- Environment files (`.env` in repo)
- Memory without encryption
- Plaintext logs

**Only**: Upstash encrypted vault (LAW 336)

**Related**: [[#LAW 336|LAW 336: Credentials in Upstash Only]]

---

### LAW 336: Credentials in Upstash Only

**Rule**: All credentials (API keys, tokens, passwords) stored exclusively in Upstash Redis with encryption.

**Storage Format**:
```
Key: `cred::{category}::{name}::{version}`
Value: AES-256-GCM encrypted blob
Metadata: rotation_date, expiry, owner
```

**Example**:
```
cred::github::ironbridge-bot::v1 = [encrypted value]
cred::groq::api-key::v2 = [encrypted value]
```

**Access Control**:
- DICK: Full access (rotation, reads)
- Soldiers: Read-only via DICK API
- Empire Auditor: Audit log read-only
- Boss: Emergency override only

**Rotation**: [[PROTOCOLS-INDEX#Rotation Protocol|Rotation Protocol]]

**Related**: [[DECREES#DECREE 5|DECREE 5: Rotate Credentials After Exposure]], [[#LAW 335|LAW 335: Credential Storage Requirement]]

---

### LAW 337: PII Redacted at Write

**Rule**: Any personally identifiable information must be redacted at the point of write.

**PII Definition**:
- Names, email addresses, phone numbers
- Addresses, postal codes
- Social security numbers, passport numbers
- Financial account identifiers
- Medical information
- IP addresses (in certain contexts)

**Implementation**:
- Regex scanning at write time
- Automatic redaction: `[REDACTED-HASH]`
- Log redaction event to audit trail
- Reject write if redaction fails

**Example**:
```
Input: "Contact Alice Smith at alice@example.com"
Output: "Contact [REDACTED-5a3f] at [REDACTED-8b2e]"
Audit: {type: "pii_redacted", hash: "5a3f", timestamp: "..."}
```

**Related**: [[DECREES#DECREE 1|DECREE 1: No PII to Claude]], [[DECREES#DECREE 4|DECREE 4: Incognito Sessions Always]]

---

### LAW 338: Silent Failure Forbidden
All operations that fail must log an event. No silent failures. Exception: transient retries (< 3 attempts) may retry silently before logging.

**Related**: [[#LAW 191|LAW 191: Circuit Breaker Pattern]]

---

### LAW 339: Never Ask Boss for Credentials

**Rule**: System never prompts Boss (human) for passwords, API keys, or secrets.

**Implementation**:
- All credentials pre-loaded from Upstash at boot
- If credential missing: escalate P0 to Boss (via Discord), not credential request
- Exception: Human login via OAuth/SSO (not applicable here)

**Rationale**: Prevents credential interception, social engineering attacks.

---

### LAW 340: Immutable Config Post-Boot
Configuration loaded at boot cannot be modified during runtime. Runtime parameter changes require restart.

---

### LAW 341: [RESERVED - Preserved for Future Amendment]

---

### LAW 342: [RESERVED - Preserved for Future Amendment]

---

### LAW 343: Boot Checklist

Every Soldier must complete this checklist before declaring `READY` state:

**Boot Checklist**:
- [ ] Load config from Upstash
- [ ] Verify all credentials present (non-null)
- [ ] Connect to Hot layer (Redis)
- [ ] Sync Cold layer (verify latest audit trail)
- [ ] Initialize DICK heartbeat (30s timer)
- [ ] Validate HMAC signing keys
- [ ] Perform self-diagnostic (CPU, memory, disk)
- [ ] Declare boot complete with SHA signature
- [ ] Enter `READY` state

**Failure**: Any step failure → halt boot, log event, escalate P0 to SARGE

**Related**: [[LAW 25|LAW 25: Read Before Act]], [[PROTOCOLS-INDEX#Boot Protocol|Boot Protocol]]

---

### LAW 344: [PRESERVED - Immutable, Immutable]

**Status**: Intentionally blank. Preserved as immutable placeholder to prevent future accidental deletion.

---

### LAW 345: Memory Resilience & Decay

**Rule**: Operational memory (non-audit) has maximum lifetime of 72 hours without refresh.

**Implementation**:
- Hot layer (Redis): 60s TTL (automatic expiry)
- Warm layer (HERMES): 5min TTL (automatic expiry)
- Cold layer (GitHub): infinite TTL (immutable archive)

**Decay Handling**:
- After 72h, Soldiers lose session state
- Must refresh from Cold layer on restart
- Audit trail (`LAW 25` data) persists forever
- Operational cache (non-audit) cleared

**Rationale**: Prevents stale decision-making, supports security via [[DECREES#DECREE 8|DECREE 8: Zero-Trust Runtime]]

**Related**: [[#LAW 3|LAW 3: Memory Decay]], [[CONSTITUTION#Persistence|Constitution: Persistence]]

---

### LAW 346: Session Artifact Location

**Status**: RATIFIED 2026-04-16 (S65 Boss directive "go" on pending-item list)

**Rule**: Every file whose filename begins with a session tag (`S##-*` or `s##-*`) MUST live under `sessions/S##/` — scripts under `sessions/S##/scripts/`. Only `VAULT-INDEX.md`, `IRONBRIDGE-MANIFESTO.md`, the active `S##-STARTUP-PROMPT.md`, and `.claude/` are permitted at vault root.

**Enforcement**:
- Hourly `audit/law-346-checks/<YYYY-MM-DD>.md` sweep via `scripts/audit-law346-check.sh`
- Write-time rejection by VETTER (when shipped per `IB-0416-VETTER-SOLDIER-001`)
- P2 ticket filed on drift per LAW 338, with duplicate-suppression

**Migration**: One-time ceremony at `audit/ceremonies/2026-04-16-vault-reorg-law346.md` proved sha256 preservation of 34 files moved and 12 cross-refs patched.

**Full text**: [[LAW-346-SESSION-ARTIFACT-LOCATION]]

**Related**: [[#LAW 25|LAW 25: Read Before Act]], [[#LAW 26|LAW 26: Audit Immutability]], [[#LAW 5|LAW 5: Three-Store Sync]], [[#LAW 338|LAW 338: Silent Failure Forbidden]]

---

## Deprecated Laws Archive

### Deprecated Ghost Soldier Laws (LAW 59-66)

**Original Purpose**: Defined first-generation Soldier synchronous protocol.

**Supersession**: Replaced by [[#LAW 6|LAW 6: Heartbeat Interval]] and async architecture (S58+).

**Historical Note**: Preserved for audit trail completeness per [[#LAW 26|LAW 26: Immutability of Audit Trail]].

---

### Deprecated Ghost Soldier Laws (LAW 71-74)

**Original Purpose**: Defined early credential storage (in-memory, pre-Upstash).

**Supersession**: Replaced by [[#LAW 336|LAW 336: Credentials in Upstash Only]].

**Historical Note**: Preserved for audit trail completeness per [[#LAW 26|LAW 26: Immutability of Audit Trail]].

---

## Cross-References

| Document | Purpose |
|----------|---------|
| [[DECREES\|Decrees]] | Eight operational imperatives |
| [[CONSTITUTION\|Constitution]] | Core values & hierarchy |
| [[PROTOCOLS-INDEX\|Protocols Index]] | Implementation details |

---

**Tags**: `#governance` `#laws` `#immutable` `#s58` `#deprecated`

**Last Verified**: 2026-04-15  
**Immutable**: Yes (LAW 106)
