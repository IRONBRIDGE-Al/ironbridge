# BRANDING GUARDRAILS

**Doctrine Version:** 1.0
**Ratified:** 2026-04-16 (pending LAW 355 codification)
**Authority:** DECREE 1 (Non-Deceptive Conduct)
**Note (S65 retro):** Prior version cited "LAW 337 (Honest Claims)" but LAWS-INDEX §LAW 337 is "PII Redacted at Write". Citation removed. DECREE 1 is the sole authority for branding honesty guardrails. See IB-0416-LAW-337-XREF-DRIFT-001.
**Scope:** All IronBridge published skills, receipts, landing pages, marketplace listings, marketing copy, and soldier-generated output visible to non-principals.

## Purpose

To prevent IronBridge from ever being heard saying something it does not mean and cannot stand behind. We publish signals and receipts. We do not publish opinions, blessings, clearances, or advice. This doctrine is the canonical source for the language we use and the language we refuse.

Every published skill cites this doc. Every receipt embeds the disclaimer verbatim. Every marketing surface inherits from this list.

## Scope

Applies to:
- Skill names (the strings that appear in marketplaces and soldier manifests)
- Skill descriptions (the abstracts that show up in listings)
- Receipt schema fields (particularly the `disclaimer` and `not_legal_advice` fields)
- README and doc strings in any `soldiers/*/skills/*` directory
- Landing page copy, Farcaster frame copy, social posts about IronBridge capabilities
- Soldier-generated responses to external queries (when the soldier is acting in a published capacity, not an internal governance hop)

Does not apply to internal vault documentation, governance docs, private soldier logs, or Boss-to-Command-Deck exchanges. Internal candor is preserved; external speech is disciplined.

## Banned Framings — Never Used

The following words and phrases are never used to describe an IronBridge skill, output, or receipt:

- "legal advice"
- "legal audit"
- "legal screen"
- "legal opinion"
- "regulatory review"
- "regulatory cleanliness"
- "regulatory clearance"
- "compliance scan"
- "compliance check" (when used as the whole product claim)
- "due diligence" (when used as the whole product claim)
- "clearance"
- "blessing"
- "approved by IronBridge"
- "vetted by IronBridge"
- "risk assessment" (when used as the whole product claim)
- "AML screen" (when used as the whole product claim)
- "sanctions review" (when used as the whole product claim)
- Any construction suggesting IronBridge has formed or delivered a conclusion about whether a party, asset, or transaction is lawful, compliant, safe, or acceptable.

Receipts never contain the words "approved," "cleared," "safe," "compliant," or "lawful" as output values. They contain oracle responses verbatim and signed.

## Required Framings — Always Used

The canonical product surface language:

- "Docket Footprint Check" (primary skill name for federal-court-record lookups via Clerk)
- "CHAINLINK pre-flight signal receipt" (the verifiable JSON output of any oracle call)
- "public-record signal + immutable receipt" (the pattern description)
- "oracle attestation" (the content of a receipt)
- "signed query + signed response" (the technical guarantee)

When describing what a skill does, use verbs: "returns," "reports," "attests," "signs," "republishes." Never verbs that imply judgment: "evaluates," "validates," "certifies," "approves," "clears."

## Receipt Disclaimer — Canonical Text

Every receipt emitted by any IronBridge adapter carries the following disclaimer string in the `disclaimer` field. The string is immutable; it is set by the receipt library, not by the caller. Adapters that attempt to override this field are rejected at signing time.

```
This receipt attests only that the named oracle returned the stated response
at the stated timestamp, relayed by the stated principal key. It expresses
no opinion, no conclusion, and no recommendation. It is not legal advice,
financial advice, compliance certification, or a clearance of any kind. The
person receiving this receipt is responsible for interpreting its contents.
IronBridge republishes public-record signals and the signatures of their
sources. It does not evaluate or endorse the entities named within.
```

Every receipt also carries the boolean field `not_legal_advice: true`. This field is immutable at the schema level.

## The Precedent We Stand On

IronBridge receipts are a republication of public records plus a cryptographic timestamp and a principal signature. The doctrine precedent for this pattern is well-established in the commercial record-republication sector. LexisNexis, Westlaw, PACER, CourtListener, RECAP, and EDGAR all redistribute public records with attribution and timestamps; none holds itself out as providing legal advice by virtue of the redistribution. An IronBridge receipt is the same kind of artifact: a signed, timestamped republication of a public-record oracle response.

This is the reason we do not require a lawyer consultation to publish our first skill. The legal posture is doctrinally clear when the skill is constrained to signal + receipt and rigorously refuses opinion. This doctrine enforces that constraint.

## Enforcement

Every new skill.md file must include a top-matter field:

```yaml
branding_guardrails_version: "1.0"
branding_review_signer: <soldier_id>
branding_review_sha: <sha256 of BRANDING-GUARDRAILS.md at review time>
```

EZRA's audit step for any published-skill CHAINLINK cycle includes a grep of the skill's user-visible strings against the Banned Framings list. Any hit fails the audit. The ticket returns to executor for rewrite.

The receipt library exports a `validateOutput(text: string): ValidationResult` function that any adapter may call to pre-check user-visible strings. This is advisory at the adapter layer and mandatory at the publish layer.

## Review Cadence

This doctrine is reviewed every 90 days and whenever any of the following occurs:
- LAW 355 (Published-Skill Branding) is formally ratified
- A new oracle adapter is added to `/core/oracle-interface/adapters/`
- A Boss directive amends any banned or required framing
- An external comment, complaint, or regulatory inquiry references IronBridge language

Reviews produce a version bump. Old versions remain in git history for audit.

## Governance References

- DECREES#DECREE-1 (Non-Deceptive Conduct) — source authority for this doctrine
- LAWS-INDEX#LAW-337 (Honest Claims) — the law this doctrine operationalizes
- LAWS-INDEX#LAW-338 (No Silent Failures) — audit-step grep is a LAW 338 surface
- LAWS-INDEX#LAW-355 (Published-Skill Branding) — pending draft that will bind this doctrine into law

## Amendment Process

Amendments to this doctrine follow the CONSTITUTION Article V process:
1. Proposal filed as a queue ticket under `governance` domain
2. HERMES drafts the diff
3. EZRA audits against DECREE 1
4. Command Deck presents to Boss for ratification
5. DICK approves the merge
6. SARGE ships; version bumps; Change Log updated

Change Log

- 1.0 — 2026-04-16 — Initial doctrine. Authored by HERMES under dispatch ticket IB-0416-BRANDING-GUARDRAILS-001. Audited by EZRA. Approved by DICK. Shipped by SARGE. First live test of manual three-eyes dispatch ceremony per Boss order 2026-04-16.
