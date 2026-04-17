# The Eight Decrees

**Status**: Ratified by S58 Master Plan  
**Authority**: THANOS Constitutional Council  
**Last Updated**: 2026-04-15

---

## DECREE 1: No PII to Claude

**Core Rule**: Zero transmission of Personally Identifiable Information to Claude or any external LLM service.

**Scope**:
- Names, addresses, phone numbers, email addresses
- Social security numbers, passport numbers, financial account identifiers
- Medical records, health information
- Any data that could identify an individual

**Implementation**: 
- Redact at write (LAW 337)
- Validate all payloads before API transmission
- Circuit breaker fallback if PII detected
- CANDOR (PDS soldier, S65 chartered → RATIFIED S66) orchestrates PII redaction on all user-facing ingest paths including voice transcripts via EZRA's `auditRedaction` primitive
- VETTER (S65 ratified) runs credential-leak-scan on all external skill ingestion

**Enforcement**: [[LAWS-INDEX#LAW 25|LAW 25]] - Read before act with SHA trail

**Related**: [[CONSTITUTION#Security|Constitution: Security Priority]]

---

## DECREE 2: DICK is Gatekeeper

**Core Rule**: All external communications flow through DICK (Distributed Intelligence Control Kernel).

**Scope**:
- API calls to Discord, GitHub, Groq, Gemini
- HTTP/HTTPS requests to third-party services
- Message broadcasting to Soldiers
- Command distribution from Boss

**Implementation**:
- DICK validates all outbound requests
- Rate limiting enforced per LAW 191 (Circuit Breaker)
- Audit log maintained in Upstash (LAW 336)
- Fallback to Hermes on DICK unavailability

**Authority Chain**: Boss → DICK → Soldiers

**Related**: [[CONSTITUTION#Hierarchy|Constitution: Hierarchy]]

---

## DECREE 3: No Autonomous Agents on Personal Machines

**Core Rule**: All Soldiers (autonomous agents) must run on Hetzner infrastructure only.

**Scope**:
- Strictly prohibits local execution of agent code
- Personal laptops, desktops, mobile devices excluded
- Development exceptions require Boss approval only

**Rationale**: 
- Reduces attack surface
- Enables uniform security posture
- Facilitates credential rotation (LAW 5, LAW 337)
- Enforces ZERO-TRUST runtime (DECREE 8)

**Implementation**: 
- Soldier template enforces Hetzner binding
- Deploy Protocol (RIPLEY only) via [[PROTOCOLS-INDEX#Deploy Protocol|Deploy Protocol]]

**Related**: [[DECREE 8|DECREE 8: Zero-Trust Runtime]]

---

## DECREE 4: Incognito Sessions Always

**Core Rule**: All browser interactions execute in incognito/private mode only.

**Scope**:
- No cookie persistence across sessions
- No local storage writes
- No browser history tracking
- Applies to human operators and automated browser interactions

**Implementation**:
- Default browser profile = incognito
- Session cookies cleared on exit
- Verify incognito flag before any web operation

**Privacy Impact**: Supports CONSTITUTION priority: PRIVACY > SECURITY > MEMORY

**Related**: [[LAWS-INDEX#LAW 337|LAW 337: PII Redacted at Write]]

---

## DECREE 5: Rotate Credentials After Exposure

**Core Rule**: Any credential exposure triggers immediate rotation across all systems.

**Rotation Schedule**:
- **Immediate**: Upon detection of exposure
- **Weekly**: High-value credentials (API keys, SSH keys)
- **Monthly**: Non-critical credentials (read-only tokens)
- **Quarterly**: Master credentials (DB passwords, admin keys)

**Storage Requirement**: Credentials stored exclusively in Upstash (encrypted) per LAW 336

**Implementation**:
- Automated rotation via [[PROTOCOLS-INDEX#Rotation Protocol|Rotation Protocol]]
- Pre-rotation notification to DICK
- Post-rotation verification checklist (LAW 343)

**Enforcement**: Every commit scanned per LAW 118

---

## DECREE 6: Obsidian Localhost:27124 — Warm Layer via Hermes JWT Proxy

**Core Rule**: Obsidian vault access routes through HERMES JWT proxy on localhost:27124.

**Architecture**:
- Obsidian editor connects to `localhost:27124`
- HERMES proxy validates JWT tokens
- Encrypts payload → Upstash (warm layer)
- Decrypts on read from warm layer

**Security**: 
- No direct Upstash writes
- All reads/writes pass through HERMES authentication
- Supports [[CONSTITUTION#Persistence|Three-Store Sync]]

**Port Specification**: TCP 27124 (immutable)

**Related**: [[PROTOCOLS-INDEX#Sync Protocol|Sync Protocol: Hot/Warm/Cold Layers]]

---

## DECREE 7: API > UI Always

**Core Rule**: All operations must be API-driven; UI interactions permitted only for human operators.

**Scope**:
- Bot interactions: 100% API
- Human operators: API-preferred, UI acceptable for manual review
- No web scraping without API fallback
- Structured data required for all operations

**Rationale**:
- Enables audit logging (LAW 25)
- Facilitates reproducibility
- Reduces attack surface vs. UI automation
- Supports circuit breaker patterns (LAW 191)

**Implementation**: All integrations use official/unofficial REST/GraphQL APIs

**Related**: [[LAWS-INDEX#LAW 87|LAW 87: Discord Primary Command Channel]]

---

## DECREE 8: Zero-Trust Runtime

**Status**: Ratified S63; CHAINLINK HMAC-SHA256 enforcement proven in S64 (EZRA verifier 33/33 tests, DICK dispatch 24/24 tests + live dry-run)
**Core Rule**: Every process assumes breach; cryptographic validation required for every operation.

**Enforcement**:
- Soldier template enforces ZERO-TRUST startup
- Every inter-process communication signed (HMAC)
- Credentials loaded from Upstash only (LAW 336)
- Boot checklist verified (LAW 343)

**Heartbeat Protocol**: Every 30s (DICK), 5min (Soldiers) with HMAC signature

**Rationale**: Supports LAW 333 (Cannot self-police — Empire Auditor exists)

**Ratification**: Completed S63. VETTER (S65) extends zero-trust to external skill ingestion boundary. CANDOR (S66 RATIFIED) extends zero-trust to voice transcripts (untrusted input until scrubbed). ARGUS (S66 RATIFIED) provides independent cold-log integrity verification per LAW 333. WICK (S66 RATIFIED per Boss directive "go" on S66 gameplan, LAW 71 original mission restored) extends zero-trust to Boss's personal-security surface — threat intelligence, digital footprint, OSINT, physical awareness — complementing SARGE (infrastructure) and CANDOR (user data).

**Related**: [[DECREE 3|DECREE 3: No Autonomous Agents on Personal Machines]], [[PROTOCOLS-INDEX#Boot Protocol|Boot Protocol]]

---

## Cross-References

| Document | Purpose |
|----------|---------|
| [[CONSTITUTION\|Constitution]] | Core values & hierarchy |
| [[LAWS-INDEX\|Laws Index]] | 345 operational laws |
| [[PROTOCOLS-INDEX\|Protocols Index]] | Implementation details |

**Tags**: `#governance` `#decrees` `#immutable` `#s58`
