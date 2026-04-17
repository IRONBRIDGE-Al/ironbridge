/**
 * IRONBRIDGE -- Credential Write Hook
 * P2 #12: Allows soldiers to update Upstash keys with automatic liveness
 * verification within 30 seconds of any write.
 *
 * LAW 341: Credential rotation automation.
 * LAW 336: All credentials in Upstash ironbridge:keys:* ONLY.
 * DECREE 8: HMAC-signed operations.
 *
 * Flow:
 *  1. Soldier calls writeCredential(soldierId, keyName, value, hmacProof)
 *  2. HMAC proof verified against soldier's derived key
 *  3. Key written to Upstash ironbridge:keys:{keyName}
 *  4. Liveness check scheduled (runs within 30s)
 *  5. If liveness check fails, key is rolled back to previous value
 *  6. Audit log written for every operation
 */

import { createHmac } from 'crypto';
import { deriveSoldierKey } from '../core/master-key';
import { auditLog } from '../core/audit';
import { safeGet, safeSet } from './upstash';

// ---- CONFIGURATION --------------------------------------------------------
const LIVENESS_CHECK_DELAY_MS = 5_000;      // Check 5s after write
const LIVENESS_CHECK_TIMEOUT_MS = 10_000;   // HTTP timeout for liveness probe
const MAX_ROLLBACK_AGE_MS = 30_000;         // Only rollback if within 30s window

// ---- SUPPORTED CREDENTIAL TYPES -------------------------------------------
interface CredentialSpec {
  livenessUrl: string;           // URL to probe
  livenessMethod: 'GET' | 'HEAD';
  livenessHeaders: (value: string) => Record<string, string>;
  expectedStatus: number[];       // Acceptable HTTP status codes
}

const CREDENTIAL_SPECS: Record<string, CredentialSpec> = {
  github_pat: {
    livenessUrl: 'https://api.github.com/user',
    livenessMethod: 'GET',
    livenessHeaders: (token: string) => ({
      'Authorization': `token ${token}`,
      'User-Agent': 'IronBridge-Soldier/1.0',
    }),
    expectedStatus: [200],
  },
  ib_gh_token: {
    livenessUrl: 'https://api.github.com/user',
    livenessMethod: 'GET',
    livenessHeaders: (token: string) => ({
      'Authorization': `token ${token}`,
      'User-Agent': 'IronBridge-Soldier/1.0',
    }),
    expectedStatus: [200],
  },
  groq_api_key: {
    livenessUrl: 'https://api.groq.com/openai/v1/models',
    livenessMethod: 'GET',
    livenessHeaders: (token: string) => ({
      'Authorization': `Bearer ${token}`,
    }),
    expectedStatus: [200],
  },
  gemini_api_key: {
    livenessUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
    livenessMethod: 'GET',
    livenessHeaders: (token: string) => ({
      'x-goog-api-key': token,
    }),
    expectedStatus: [200],
  },
  discord_token: {
    livenessUrl: 'https://discord.com/api/v10/users/@me',
    livenessMethod: 'GET',
    livenessHeaders: (token: string) => ({
      'Authorization': `Bot ${token}`,
    }),
    expectedStatus: [200],
  },
  hetzner_api: {
    livenessUrl: 'https://api.hetzner.cloud/v1/servers',
    livenessMethod: 'GET',
    livenessHeaders: (token: string) => ({
      'Authorization': `Bearer ${token}`,
    }),
    expectedStatus: [200],
  },
  bankr_llm_key: {
    livenessUrl: 'https://llm.bankr.fi/v1/models',
    livenessMethod: 'GET',
    livenessHeaders: (token: string) => ({
      'Authorization': `Bearer ${token}`,
    }),
    expectedStatus: [200],
  },
};

// ---- TYPES ----------------------------------------------------------------
interface WriteResult {
  success: boolean;
  livenessScheduled: boolean;
  previousValue: string | null;
  error?: string;
}

interface LivenessResult {
  alive: boolean;
  statusCode?: number;
  rolledBack: boolean;
  error?: string;
}

// ---- HMAC VERIFICATION ----------------------------------------------------
function verifyWriteHmac(
  soldierId: string,
  keyName: string,
  value: string,
  hmacProof: string
): boolean {
  const soldierKey = deriveSoldierKey(soldierId, 'credential-write');
  const payload = `${soldierId}:${keyName}:${value}`;
  const expected = createHmac('sha256', soldierKey)
    .update(payload)
    .digest('hex');
  return hmacProof === expected;
}

// ---- LIVENESS CHECK -------------------------------------------------------
async function checkLiveness(
  keyName: string,
  value: string
): Promise<LivenessResult> {
  const spec = CREDENTIAL_SPECS[keyName];
  if (!spec) {
    // No liveness spec for this key type -- skip check, report success
    return { alive: true, rolledBack: false };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), LIVENESS_CHECK_TIMEOUT_MS);

    const response = await fetch(spec.livenessUrl, {
      method: spec.livenessMethod,
      headers: spec.livenessHeaders(value),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const alive = spec.expectedStatus.includes(response.status);
    return {
      alive,
      statusCode: response.status,
      rolledBack: false,
    };
  } catch (err) {
    return {
      alive: false,
      rolledBack: false,
      error: (err as Error).message,
    };
  }
}

// ---- MAIN WRITE FUNCTION --------------------------------------------------

/**
 * Write a credential to Upstash with HMAC verification and automatic
 * liveness check within 30 seconds. Rolls back on liveness failure.
 *
 * @param soldierId - The soldier requesting the write
 * @param keyName   - Key name (without ironbridge:keys: prefix)
 * @param value     - The credential value
 * @param hmacProof - HMAC-SHA256 proof: HMAC(soldierId + ":" + keyName + ":" + value, soldierKey)
 * @returns WriteResult with success status and liveness scheduling info
 */
export async function writeCredential(
  soldierId: string,
  keyName: string,
  value: string,
  hmacProof: string
): Promise<WriteResult> {
  const fullKey = `ironbridge:keys:${keyName}`;
  const writeTimestamp = Date.now();

  // Step 1: Verify HMAC proof
  if (!verifyWriteHmac(soldierId, keyName, value, hmacProof)) {
    await auditLog({
      soldier: soldierId,
      action: 'credential_write_rejected',
      target: fullKey,
      result: 'HMAC verification failed',
    });
    return {
      success: false,
      livenessScheduled: false,
      previousValue: null,
      error: 'HMAC verification failed',
    };
  }

  // Step 2: Read previous value for rollback
  const previousValue = await safeGet(fullKey);

  // Step 3: Write new value
  const written = await safeSet(soldierId, fullKey, value);
  if (!written) {
    await auditLog({
      soldier: soldierId,
      action: 'credential_write_failed',
      target: fullKey,
      result: 'Upstash SET failed',
    });
    return {
      success: false,
      livenessScheduled: false,
      previousValue,
      error: 'Upstash SET failed',
    };
  }

  // Step 4: Log the write
  await auditLog({
    soldier: soldierId,
    action: 'credential_written',
    target: fullKey,
    result: `Written by ${soldierId} at ${new Date(writeTimestamp).toISOString()}`,
  });

  // Step 5: Schedule liveness check
  const hasSpec = keyName in CREDENTIAL_SPECS;

  if (hasSpec) {
    setTimeout(async () => {
      try {
        const elapsed = Date.now() - writeTimestamp;
        if (elapsed > MAX_ROLLBACK_AGE_MS) {
          console.warn(`[CRED-HOOK] Liveness check for ${fullKey} skipped — outside rollback window`);
          return;
        }

        const liveness = await checkLiveness(keyName, value);

        if (!liveness.alive) {
          // ROLLBACK: Restore previous value
          if (previousValue !== null) {
            await safeSet(soldierId, fullKey, previousValue);
            console.error(`[CRED-HOOK] ROLLBACK ${fullKey} — liveness failed (${liveness.statusCode || liveness.error})`);
          } else {
            console.error(`[CRED-HOOK] LIVENESS FAILED for ${fullKey} — no previous value to rollback`);
          }

          await auditLog({
            soldier: soldierId,
            action: 'credential_liveness_failed',
            target: fullKey,
            result: `Rolled back: ${liveness.rolledBack}, Status: ${liveness.statusCode || 'N/A'}, Error: ${liveness.error || 'N/A'}`,
          });
        } else {
          // Write liveness confirmation
          await safeSet(
            soldierId,
            `${fullKey}:liveness`,
            JSON.stringify({
              checked: new Date().toISOString(),
              status: liveness.statusCode,
              soldier: soldierId,
            }),
            3600 // 1hr TTL on liveness confirmation
          );

          await auditLog({
            soldier: soldierId,
            action: 'credential_liveness_passed',
            target: fullKey,
            result: `HTTP ${liveness.statusCode}`,
          });
        }
      } catch (err) {
        console.error(`[CRED-HOOK] Liveness check error for ${fullKey}: ${(err as Error).message}`);
      }
    }, LIVENESS_CHECK_DELAY_MS);
  }

  return {
    success: true,
    livenessScheduled: hasSpec,
    previousValue: previousValue ? '[REDACTED]' : null,
  };
}

/**
 * Generate the HMAC proof a soldier needs to call writeCredential().
 * Called locally by the soldier before making the write request.
 */
export function generateWriteHmac(
  soldierId: string,
  keyName: string,
  value: string
): string {
  const soldierKey = deriveSoldierKey(soldierId, 'credential-write');
  const payload = `${soldierId}:${keyName}:${value}`;
  return createHmac('sha256', soldierKey)
    .update(payload)
    .digest('hex');
}
