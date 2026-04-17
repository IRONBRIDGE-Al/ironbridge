# Implementation Protocols

**Ratified**: S58 Master Plan  
**Authority**: THANOS / DICK  
**Status**: Living Implementation Guide (updateable, governed by LAW 106)

---

## Overview

This document specifies how the Eight Decrees and 345 Laws are implemented in practice. Protocols are updateable (unlike laws) but must align with immutable constitutional principles.

**Key Principle**: All protocols must support [[CONSTITUTION|Constitutional]] values: Autonomy, Accountability, Security, Persistence, Hierarchy.

---

## Boot Protocol

**Purpose**: Secure, signed startup sequence for Soldiers and system components.

**Sequence**: 6 steps (immutable order)

### Step 1: Load Configuration from Upstash

**Input**: Soldier ID (e.g., `Soldier-Alpha`)

**Action**:
- Connect to Upstash Redis
- Fetch config key: `config::{soldier_id}`
- Verify JSON schema (reject malformed)
- Extract: task queue, credentials manifest, HMAC signing keys

**Output**: Configuration object (in-memory)

**Validation**: [[LAWS-INDEX#LAW 30|LAW 30: Storage Validation]]

---

### Step 2: Verify All Credentials Present

**Input**: Credentials manifest from Step 1

**Action**:
- For each credential reference:
  - Query Upstash: `cred::{category}::{name}::{version}`
  - Decrypt using local HMAC key
  - Verify non-null
  - Store in memory (encrypted at rest)

**Success Criteria**: All credentials decrypted without error

**Failure**: Escalate P0 to SARGE, log event with SHA (LAW 25)

**Validation**: [[LAWS-INDEX#LAW 336|LAW 336: Credentials in Upstash Only]], [[LAWS-INDEX#LAW 25|LAW 25: Read Before Act]]

---

### Step 3: Connect to Hot Layer (Redis)

**Input**: Redis connection string from Step 1

**Action**:
- Attempt connection to Upstash Redis
- Verify read/write capability (PING + SET test)
- Register heartbeat timer (30s for DICK, 5min for Soldiers)
- Log read event with SHA signature (LAW 25)

**Success Criteria**: Redis PING succeeds, heartbeat timer active

**Failure**: Fallback to Warm layer (HERMES) via circuit breaker (LAW 191)

**Related**: [[LAWS-INDEX#LAW 6|LAW 6: Heartbeat Interval]], [[#Heartbeat Protocol|Heartbeat Protocol]]

---

### Step 4: Sync Cold Layer Verification

**Input**: Cold layer (GitHub Gists archive)

**Action**:
- Fetch latest audit trail checkpoint from Cold layer
- Verify chain-of-custody (each entry signed with SHA-256)
- Detect any gaps (missing entries between last boot and now)
- If gaps: escalate P1 to SARGE for audit review

**Success Criteria**: Cold layer hash chain valid, no gaps detected

**Failure**: Continue with warning, but log event with timestamp

**Related**: [[LAWS-INDEX#LAW 5|LAW 5: Three-Store Sync]], [[#Sync Protocol|Sync Protocol]]

---

### Step 5: Initialize DICK Heartbeat & Validate HMAC Keys

**Input**: HMAC signing keys from Step 1

**Action**:
- Import HMAC keys (one per operation type: read, write, heartbeat, escalate)
- Start heartbeat timer (30s for DICK, 5min for Soldiers)
- Sign boot event with `heartbeat` HMAC key
- Send initial heartbeat to DICK
- Validate HMAC keys by signing/verifying test message

**Success Criteria**: HMAC test succeeds, heartbeat received by DICK

**Failure**: Escalate P0, halt boot

**Related**: [[#Heartbeat Protocol|Heartbeat Protocol]], [[DECREES#DECREE 8|DECREE 8: Zero-Trust Runtime]]

---

### Step 6: Self-Diagnostic & Declaration

**Input**: System resources (CPU, memory, disk)

**Action**:
- Check available memory (minimum 256MB required)
- Check disk space (minimum 1GB free required)
- Check CPU cores available
- Log diagnostic results with timestamp
- Generate boot completion signature (SHA of all steps)
- Declare boot complete

**Success Criteria**: All diagnostics pass, boot signature generated

**Failure**: Escalate P1 to SARGE, enter degraded mode

**Related**: [[LAWS-INDEX#LAW 343|LAW 343: Boot Checklist]], [[#Degraded Mode Protocol|Degraded Mode Protocol]]

---

### Boot Protocol Summary

```
BOOT SEQUENCE:
  1. Load Config from Upstash
  2. Verify Credentials Present
  3. Connect to Hot Layer (Redis)
  4. Sync Cold Layer Verification
  5. Initialize HMAC & Heartbeat
  6. Self-Diagnostic & Declaration
  
  On any step failure: escalate to SARGE (P0 or P1)
```

**Expected Duration**: 5-10 seconds

**Triggered By**: 
- Soldier startup (Hetzner container init)
- System restart (DICK recovery)
- Scheduled boot refresh (weekly)

---

## Heartbeat Protocol

**Purpose**: Continuous system health verification with cryptographic signatures.

**Frequency**:
- **DICK**: Every 30 seconds
- **Soldiers** (15 total): Every 5 minutes — SARGE, HERMES, BROOKS, OSCAR, RACHEL, GARY, PAUL, EZRA, RIPLEY, VETTER, ATHENA, CANDOR, WICK, ARGUS
- **SARGE**: Every 5 minutes (passive listener + P0 escalation)

### Heartbeat Message Format

```json
{
  "type": "heartbeat",
  "sender": "Soldier-Alpha",
  "timestamp": "2026-04-15T14:32:01Z",
  "sequence_number": 12345,
  "health": {
    "status": "healthy",
    "memory_usage_mb": 245,
    "pending_tasks": 3,
    "last_task_completion": "2026-04-15T14:31:55Z"
  },
  "hmac_signature": "sha256:a3f5b8d9e1c2f4a6b8d0e1f3a5b7c9d1e3f5a7b9d1c3e5f7a9b1d3e5f7a9b1"
}
```

### HMAC Signature Generation

**Algorithm**: HMAC-SHA256

**Input Data** (in order):
1. `sender` field
2. `timestamp` field
3. `sequence_number` field
4. `health` JSON (serialized, canonical form)

**Signing Key**: Retrieved from Upstash at boot (`cred::hmac::heartbeat::v1`)

**Verification**: DICK verifies HMAC before accepting heartbeat

**Related**: [[DECREES#DECREE 8|DECREE 8: Zero-Trust Runtime]], [[LAWS-INDEX#LAW 6|LAW 6: Heartbeat Interval]]

---

### Heartbeat Processing by DICK

**On Receipt**:
1. Verify HMAC signature (reject if invalid)
2. Check sequence number (warn if gap)
3. Update sender's last-seen timestamp in Hot layer
4. If health status = `degraded` → escalate P2 to SARGE
5. If health status = `critical` → escalate P0 to SARGE
6. Acknowledge receipt (silent success, explicit failure)

**Missing Heartbeat Handling**:
- After 2 missed heartbeats (10min for Soldiers): escalate P1 to SARGE
- After 4 missed heartbeats (20min for Soldiers): escalate P0, assume Soldier dead
- Initiate automatic Soldier restart on Hetzner

---

## Broadcast Protocol

**Purpose**: Message distribution from DICK to multiple Soldiers without pub/sub infrastructure.

**Architecture**: Polling-based (not Pub/Sub, per architectural constraint)

**Frequency**: Soldiers poll DICK every 30 seconds for new messages

### Broadcast Message Format

```json
{
  "type": "broadcast",
  "message_id": "msg-uuid-12345",
  "sender": "DICK",
  "recipients": ["Soldier-Alpha", "Soldier-Beta"],
  "timestamp": "2026-04-15T14:32:01Z",
  "content": {
    "command": "task_assign",
    "task_id": "task-uuid-67890",
    "objective": "Scan GitHub for secrets",
    "deadline": "2026-04-16T00:00:00Z"
  },
  "ttl_seconds": 300,
  "hmac_signature": "sha256:..."
}
```

### Broadcast Lifecycle

1. **Publishing** (DICK side):
   - Create message with TTL = 300s
   - Store in Hot layer: `broadcast::{message_id}`
   - Sign with HMAC (heartbeat key)
   - Log to audit trail (Cold layer)

2. **Polling** (Soldier side):
   - Every 30 seconds, query: `broadcast::*` from Hot layer
   - Verify HMAC signature
   - If TTL expired: ignore, don't log error
   - If TTL valid & HMAC valid: process and acknowledge

3. **Acknowledgment** (Soldier side):
   - Return: `{message_id, status, timestamp, hmac_signature}`
   - Store in Hot layer: `broadcast_ack::{message_id}::{soldier_id}`

4. **Cleanup** (DICK side):
   - After TTL expires: auto-delete from Hot layer
   - Confirm acks received before deletion
   - Log completion to audit trail

**TTL Rationale**: 5 minutes gives Soldiers 10 polling cycles to receive message.

**Related**: [[DECREES#DECREE 2|DECREE 2: DICK is Gatekeeper]], [[#Heartbeat Protocol|Heartbeat Protocol]]

---

## Sync Protocol

**Purpose**: Three-store synchronization with conflict resolution and consistency guarantees.

**Architecture**: Hot (60s) → Warm (5min) → Cold (5min)

### Sync Sequence

```
Application writes data
   ↓
1. Write to Hot (Redis, 60s TTL)
   - Synchronous operation
   - Fail fast if unavailable
   
   ↓ (every 5 minutes, async)
2. Write to Warm (HERMES JWT proxy)
   - Encrypt payload with AES-256-GCM
   - TTL = 5 minutes
   - Fail: circuit breaker (LAW 191)
   
   ↓ (every 5 minutes, async)
3. Write to Cold (GitHub Gists)
   - Append-only audit trail format
   - TTL = infinite (immutable)
   - Fail: escalate P1 to SARGE, retry on next cycle
```

### Conflict Resolution

**Rule**: Timestamp wins (last-write-wins)

**Scenario**: Multiple Soldiers write same key within 5 seconds

```
Soldier-Alpha writes X=5 at 2026-04-15T14:32:01Z
Soldier-Beta writes X=7 at 2026-04-15T14:32:02Z

Result in Hot layer: X=7 (Beta's timestamp is later)
Log conflict event: {type: conflict, key: X, winner: Beta, timestamp: 2026-04-15T14:32:02Z}
```

**Causality**: If operations have same timestamp, Soldier ID alphabetically wins (fallback).

### Warm Layer Details

**Storage**: Upstash Redis with HERMES JWT proxy encryption

**Encryption**: 
- Algorithm: AES-256-GCM
- Key: Derived from HMAC key (LAW 336)
- IV: Random, stored with ciphertext
- Auth Tag: Appended to ciphertext

**Access Control**:
- HERMES proxy validates JWT token
- Token includes: soldier_id, operation (read/write), timestamp
- Token signature: HMAC-SHA256
- Token TTL: 15 minutes

### Cold Layer Details

**Storage**: GitHub Gists (per `ironbridge-vault` organization)

**Naming**: 
- Gist ID: `cold-{date}-{sequence}.json`
- Example: `cold-2026-04-15-001.json`

**Format**:
```json
[
  {
    "vault": "ironbridge",
    "layer": "cold",
    "timestamp": "2026-04-15T14:32:01Z",
    "soldier_id": "Soldier-Alpha",
    "operation": "write",
    "key": "task::uuid-12345",
    "value_hash": "sha256:a3f5b8d9...",
    "signature": "hmac:sha256:..."
  }
]
```

### Sync Protocol Guarantees

- **Hot**: Real-time, volatile (60s TTL)
- **Warm**: Active session cache (5min TTL)
- **Cold**: Immutable permanent record
- **Consistency**: Eventually consistent (within 5min)
- **Durability**: Cold layer is durable

**Related**: [[LAWS-INDEX#LAW 5|LAW 5: Three-Store Sync]], [[CONSTITUTION#Persistence|Constitution: Persistence]]

---

## Escalation Protocol

**Purpose**: Route critical events to appropriate handlers with time guarantees.

### Severity Levels

| Level | Response Time | Handler | Channel | Example |
|-------|---|---------|---------|---------|
| **P0** | Immediate | SARGE → Boss | Discord `#escalations` | System compromise, PII leak, DICK down |
| **P1** | < 5min | DICK or SARGE | Discord `#escalations` | Major API failure, Soldier unresponsive |
| **P2** | < 30min | DICK | Discord `#escalations` or internal log | Rate limit hit, transient failure |
| **P3** | < 6h | Soldier | Internal log | Non-critical task failure |
| **P4** | Next session | Background | Internal log | Optimization opportunity, archive cleanup |

### Escalation Flow

```
Event detected by Soldier/DICK
  ↓
Classify severity (P0-P4)
  ↓
Log event with SHA signature (LAW 25)
  ↓
If P0: Escalate to SARGE immediately
If P1-P2: Post to Discord `#escalations` channel
If P3-P4: Log only, no alert
  ↓
SARGE reviews P0 events
  ↓
SARGE decides: handle locally OR escalate to Boss
  ↓
If Boss escalation: Direct Discord DM or `#commands` reply
```

### P0 Escalation Format

```json
{
  "type": "escalation_p0",
  "soldier_id": "Soldier-Alpha",
  "timestamp": "2026-04-15T14:32:01Z",
  "event": {
    "type": "pii_detected",
    "location": "github.com/ironbridge/config",
    "pii_type": "email",
    "action_taken": "write_rejected"
  },
  "immediate_action_needed": true,
  "hmac_signature": "sha256:..."
}
```

### P0 Handler (SARGE) Actions

1. **Acknowledge**: Log receipt with timestamp
2. **Investigate**: Query audit trail for related events
3. **Decide**:
   - Local containment (P0 fallback procedures)
   - OR Boss notification (via Discord direct message)
4. **Execute**: Implement decision
5. **Report**: Return summary to Discord `#escalations`

**Response Guarantee**: SARGE must acknowledge P0 within 30 seconds.

**Related**: [[CONSTITUTION#Hierarchy|Constitution: Hierarchy]], [[DECREES#DECREE 2|DECREE 2: DICK is Gatekeeper]]

---

## Deploy Protocol

**Purpose**: Safe production deployment of Soldier code with zero-downtime updates.

**Authority**: RIPLEY (deployment automation only)

### Deployment Sequence

```
Step 1: Code Merge to Main Branch
        (after secret scan pass, LAW 118)
        
  ↓
  
Step 2: RIPLEY Triggered (GitHub Actions)
        - Build Docker image
        - Tag with version + commit SHA
        
  ↓
  
Step 3: Staging Deployment
        - Deploy to staging Hetzner instance
        - Run smoke tests
        - Verify all protocols (boot, heartbeat, etc.)
        
  ↓
  
Step 4: Blue-Green Deployment
        - Blue (current): handling live traffic
        - Green (new): running new version
        - Route health checks to Green
        - If all Green health checks pass → switch traffic
        - If any Green health check fails → auto-rollback
        
  ↓
  
Step 5: Health Verification (5 min)
        - Monitor Green traffic for errors
        - If error rate > 0.1% for 1 min → rollback
        - Else → mark deployment successful
        
  ↓
  
Step 6: Cleanup
        - Delete old Blue instance
        - Archive deployment logs
        - Post summary to Discord `#heartbeats`
```

### Health Check Details

**Frequency**: Every 10 seconds

**Checks**:
- HTTP GET `localhost:8080/health` → expects `{status: "ok"}`
- Verify heartbeat connectivity to DICK
- Verify Redis connectivity
- Verify GitHub API access

**Failure Threshold**: 3 consecutive failed checks → rollback

### Rollback Procedure

```
1. Stop routing traffic to Green
2. Restart Blue instance (previous version)
3. Verify Blue health checks pass
4. Route all traffic back to Blue
5. Log rollback event with reason
6. Escalate P1 to SARGE (deployment failed)
7. Notify team via Discord `#escalations`
```

**Rollback Triggers**:
- Health checks fail (3+ consecutive)
- Error rate spike (> 0.1% for 1 min)
- Manual decision by RIPLEY admin

### Deployment Constraints

- **Frequency**: Max 1 deployment per hour (prevent thrashing)
- **Downtime**: Zero (blue-green guarantee)
- **Rollback Time**: < 2 minutes
- **Verification**: All tests pass before merge to main

**Related**: [[LAWS-INDEX#LAW 121|LAW 121: RIPLEY Deploys Only]], [[LAWS-INDEX#LAW 120|LAW 120: Blue-Green Deployment]]

---

## Rotation Protocol

**Purpose**: Automatic credential rotation with zero operational downtime.

**Rotation Schedule**:

| Category | Interval | Trigger |
|----------|----------|---------|
| High-value (API keys, SSH) | Weekly | Tuesday 00:00 UTC |
| Non-critical (read-only tokens) | Monthly | 1st of month 00:00 UTC |
| Master (DB passwords) | Quarterly | Q1/Q2/Q3/Q4 start, 00:00 UTC |
| Emergency | Immediate | Exposure detected (DECREE 5) |

### Rotation Sequence

```
Step 1: Pre-Rotation Planning
        - DICK queries credential manifest from Upstash
        - Identify credentials due for rotation
        - Plan rotation window (minimal impact)
        
  ↓
  
Step 2: Generate New Credentials
        - Contact credential issuer (GitHub, Groq, etc.)
        - Request new token/key
        - Verify new credential works (test API call)
        
  ↓
  
Step 3: Parallel Credential Period
        - Update Upstash: add new credential version
        - Keep old credential for 1 hour (overlap window)
        - Update Soldiers to use new credential
        
  ↓
  
Step 4: Validation
        - Verify all Soldiers using new credential
        - Monitor error rate (should be zero)
        - If error: rollback to old credential
        
  ↓
  
Step 5: Cleanup
        - Delete old credential from Upstash (after 1 hour)
        - Revoke old credential at issuer
        - Log rotation event (LAW 25)
        - Post summary to Discord `#heartbeats`
```

### Emergency Rotation (Exposure Detected)

```
1. Generate new credential immediately
2. Skip 1-hour overlap (use new credential only)
3. Force Soldier restart if necessary
4. Escalate P0 to SARGE
5. Rotate immediately if Boss authorizes
```

### Credential Update Mechanism

**Soldiers fetch new credentials via DICK**:

```
Soldier queries: GET /api/credential/groq/latest
DICK returns: {value: "new-key", version: "v2", expires: "..."}
Soldier updates in-memory credential
Soldier verifies new credential with test API call
On failure: revert to old credential, escalate P2
```

**Related**: [[DECREES#DECREE 5|DECREE 5: Rotate Credentials After Exposure]], [[LAWS-INDEX#LAW 336|LAW 336: Credentials in Upstash Only]]

---

## Degraded Mode Protocol

**Purpose**: Graceful operation when critical dependencies fail.

### Degradation Scenarios

| Failure | Status | Fallback |
|---------|--------|----------|
| Upstash (Hot) down | Hot unavailable | Use Warm layer only |
| HERMES (Warm) down | Warm unavailable | Use Cold layer + local SQLite |
| GitHub (Cold) down | Cold unavailable | Buffer to local SQLite, sync on recovery |
| DICK unavailable | DICK down | Soldiers use cached config, heartbeat to SARGE only |
| Groq down | Groq unavailable | Route LLM requests to Gemini (fallback) |

### Cold → SQLite Fallback

**Trigger**: Upstash unreachable for > 1 minute

**Implementation**:
```
Soldier initializes local SQLite database:
  schema: 
    - events (id, timestamp, type, payload, signature)
    - heartbeats (soldier_id, timestamp, health)
    
On write (data meant for Hot/Warm):
  - Attempt write to Hot (Upstash) with timeout=5s
  - On timeout: write to local SQLite instead
  - Log fallback event
  - Continue normal operation
```

### Recovery & Replay

**Trigger**: Upstash reconnection detected

**Sequence**:
```
1. Test Upstash connectivity (PING)
2. If online:
   - Read all events from local SQLite
   - Replay to Upstash Hot layer (in timestamp order)
   - Verify all events received by DICK (heartbeat ack)
   - Delete local SQLite events
3. Resume normal operation
```

**Failure Handling**:
- If replay fails: escalate P1 to SARGE
- Keep SQLite database as backup
- Retry replay on next recovery attempt

### DICK Unavailability (Local Operation Mode)

**Trigger**: DICK heartbeat unresponsive for > 10 minutes

**Fallback**:
- Soldiers operate independently
- Heartbeats sent to SARGE (direct, not via DICK)
- SARGE buffers commands; executes on DICK recovery
- Soldiers use cached task queue (from last sync)

**Reactivation**:
- DICK comes online
- SARGE forwards buffered commands to DICK
- DICK resumes heartbeat with Soldiers
- Normal operation resumes

### Degraded Mode Constraints

- **Duration**: Up to 6 hours (escalate P1 if longer)
- **Data Loss**: None (SQLite buffer prevents loss)
- **Functionality**: All critical tasks continue
- **Audit Trail**: Continues (Cold layer unaffected)

**Related**: [[LAWS-INDEX#LAW 191|LAW 191: Circuit Breaker]], [[LAWS-INDEX#LAW 4|LAW 4: Graceful Degradation]]

---

## Skill Runtime Protocol (SRP-1.0)

**Purpose**: Standardized skill module format for soldier skill development, loading, execution, and auditing.

**Specification**: See `governance/SKILL-RUNTIME-PROTOCOL.md` for full protocol.

**Key Requirements**:
- Every skill exports `meta: SkillMeta` and `run(input, ctx): Promise<SkillOutcome>`
- LAW 338: Skills never throw — all errors return structured SkillOutcome
- LAW 25: Every file read populates readTrail with source, sha256, timestamp, soldier_id, purpose
- DICK loads skills via `soldiers/<name>/src/skills/<skill-name>/index.ts`
- EZRA audits outcomes via structured-outcome-verify and read-trail-verify skills

**Status**: RATIFIED S66. 13 skills operational across 4 soldiers.

**Related**: [[SKILL-RUNTIME-PROTOCOL]], [[LAWS-INDEX#LAW 338|LAW 338]], [[LAWS-INDEX#LAW 25|LAW 25]]

---

## Cross-Protocol References

| Protocol | Related Laws | Related Decrees |
|----------|--------------|-----------------|
| Boot Protocol | [[LAWS-INDEX#LAW 343|LAW 343]], [[LAWS-INDEX#LAW 25|LAW 25]] | [[DECREES#DECREE 8|DECREE 8]] |
| Heartbeat Protocol | [[LAWS-INDEX#LAW 6|LAW 6]], [[LAWS-INDEX#LAW 5|LAW 5]] | [[DECREES#DECREE 8|DECREE 8]] |
| Broadcast Protocol | [[LAWS-INDEX#LAW 87|LAW 87]], [[LAWS-INDEX#LAW 91|LAW 91]] | [[DECREES#DECREE 2|DECREE 2]] |
| Sync Protocol | [[LAWS-INDEX#LAW 5|LAW 5]], [[LAWS-INDEX#LAW 337|LAW 337]] | [[DECREES#DECREE 6|DECREE 6]] |
| Escalation Protocol | [[LAWS-INDEX#LAW 25|LAW 25]], [[LAWS-INDEX#LAW 333|LAW 333]] | All |
| Deploy Protocol | [[LAWS-INDEX#LAW 121|LAW 121]], [[LAWS-INDEX#LAW 118|LAW 118]] | [[DECREES#DECREE 7|DECREE 7]] |
| Rotation Protocol | [[LAWS-INDEX#LAW 336|LAW 336]], [[LAWS-INDEX#LAW 5|LAW 5]] | [[DECREES#DECREE 5|DECREE 5]] |
| Degraded Mode Protocol | [[LAWS-INDEX#LAW 191|LAW 191]], [[LAWS-INDEX#LAW 4|LAW 4]] | [[DECREES#DECREE 3|DECREE 3]] |
| Skill Runtime Protocol | [[LAWS-INDEX#LAW 338|LAW 338]], [[LAWS-INDEX#LAW 25|LAW 25]] | [[DECREES#DECREE 8|DECREE 8]] |

---

**Tags**: `#governance` `#protocols` `#implementation` `#s58`

**Last Verified**: 2026-04-15  
**Status**: Living Implementation Guide
