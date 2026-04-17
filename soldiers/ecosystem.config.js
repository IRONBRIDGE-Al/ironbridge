/**
 * IRONBRIDGE — PM2 Ecosystem (S69 Deploy)
 * Uses compiled node (not npx tsx) to fit 2GB RAM
 * S67 Fischer Fix: Upstash creds in env for all soldiers
 */
const fs = require("fs");
const path = require("path");

function loadEnvFile(fp) {
  try {
    if (!fs.existsSync(fp)) return {};
    const c = fs.readFileSync(fp, "utf-8");
    const v = {};
    for (const l of c.split("\n")) {
      const t = l.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i === -1) continue;
      v[t.slice(0, i).trim()] = t.slice(i + 1).trim();
    }
    return v;
  } catch { return {}; }
}

const env = { ...loadEnvFile(__dirname + "/.env"), ...loadEnvFile("/home/ironbridge/.env") };
for (const [k, v] of Object.entries(env)) { if (!process.env[k] && v) process.env[k] = v; }

const U_URL = env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const U_TOK = env.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";
const G_PAT = env.GITHUB_PAT || env.IB_GH_TOKEN || process.env.GITHUB_PAT || process.env.IB_GH_TOKEN || "";
const D_TOK = env.DISCORD_TOKEN || process.env.DISCORD_TOKEN || "";
const Q_TOK = env.QSTASH_TOKEN || process.env.QSTASH_TOKEN || "";

if (!U_TOK) {
  console.error("P0: No UPSTASH_REDIS_REST_TOKEN found in .env or env");
}

const BASE = {
  NODE_ENV: "production",
  IRONBRIDGE_ENV: "prod",
  UPSTASH_REDIS_REST_URL: U_URL,
  UPSTASH_REDIS_REST_TOKEN: U_TOK,
  GITHUB_PAT: G_PAT,
  IB_GH_TOKEN: G_PAT,
};

const TPL = "./ironbridge-soldier-template/dist/run.js";

const common = {
  script: TPL,
  interpreter: "node",
  interpreter_args: "--max-old-space-size=128",
  cwd: "/home/ironbridge/soldiers",
  watch: false,
  max_memory_restart: "200M",
  kill_timeout: 10000,
  min_uptime: 5000,
  max_restarts: 10,
  restart_delay: 5000,
  autorestart: true,
  merge_logs: true,
  log_date_format: "YYYY-MM-DDTHH:mm:ss.SSSZ",
};

module.exports = {
  apps: [
    { ...common, name: "dick-commander", script: "./dick-commander/dist/index.js", env: { ...BASE, SOLDIER_ID: "dick", SOLDIER_NAME: "DICK", HEARTBEAT_INTERVAL_MS: "30000", IDLE_CYCLE_INTERVAL_MS: "300000", DAILY_BRIEF_HOUR: "9", DAILY_BRIEF_MINUTE: "30", DISCORD_CHANNEL_ID: "1492932943889436784", DISCORD_SERVER_ID: "1492932907755503689", DISCORD_TOKEN: D_TOK, QSTASH_TOKEN: Q_TOK } },
    { ...common, name: "hermes-memory", script: "./hermes-memory/dist/index.js", env: { ...BASE, SOLDIER_ID: "hermes", SOLDIER_NAME: "HERMES", HEARTBEAT_INTERVAL_MS: "60000", IDLE_CYCLE_INTERVAL_MS: "60000" } },
    { ...common, name: "sarge-security", env: { ...BASE, SOLDIER_ID: "sarge", SOLDIER_NAME: "SARGE", HEARTBEAT_INTERVAL_MS: "60000", IDLE_CYCLE_INTERVAL_MS: "300000" } },
    { ...common, name: "coffey-infra", env: { ...BASE, SOLDIER_ID: "coffey", SOLDIER_NAME: "COFFEY", HEARTBEAT_INTERVAL_MS: "60000", IDLE_CYCLE_INTERVAL_MS: "300000" } },
    { ...common, name: "wick-security", env: { ...BASE, SOLDIER_ID: "wick", SOLDIER_NAME: "WICK", HEARTBEAT_INTERVAL_MS: "60000", IDLE_CYCLE_INTERVAL_MS: "300000" } },
    { ...common, name: "brooks-code", env: { ...BASE, SOLDIER_ID: "brooks", SOLDIER_NAME: "BROOKS", HEARTBEAT_INTERVAL_MS: "300000", IDLE_CYCLE_INTERVAL_MS: "600000" } },
    { ...common, name: "oscar-frontend", env: { ...BASE, SOLDIER_ID: "oscar", SOLDIER_NAME: "OSCAR", HEARTBEAT_INTERVAL_MS: "300000", IDLE_CYCLE_INTERVAL_MS: "600000" } },
    { ...common, name: "rachel-intel", env: { ...BASE, SOLDIER_ID: "rachel", SOLDIER_NAME: "RACHEL", HEARTBEAT_INTERVAL_MS: "300000", IDLE_CYCLE_INTERVAL_MS: "900000" } },
    { ...common, name: "gary-growth", env: { ...BASE, SOLDIER_ID: "gary", SOLDIER_NAME: "GARY", HEARTBEAT_INTERVAL_MS: "300000", IDLE_CYCLE_INTERVAL_MS: "900000" } },
    { ...common, name: "paul-product", env: { ...BASE, SOLDIER_ID: "paul", SOLDIER_NAME: "PAUL", HEARTBEAT_INTERVAL_MS: "300000", IDLE_CYCLE_INTERVAL_MS: "900000" } },
    { ...common, name: "ezra-qa", env: { ...BASE, SOLDIER_ID: "ezra", SOLDIER_NAME: "EZRA", HEARTBEAT_INTERVAL_MS: "300000", IDLE_CYCLE_INTERVAL_MS: "600000" } },
    { ...common, name: "ripley-deploy", env: { ...BASE, SOLDIER_ID: "ripley", SOLDIER_NAME: "RIPLEY", HEARTBEAT_INTERVAL_MS: "300000", IDLE_CYCLE_INTERVAL_MS: "600000" } },
    { ...common, name: "vetter-discovery", env: { ...BASE, SOLDIER_ID: "vetter", SOLDIER_NAME: "VETTER", HEARTBEAT_INTERVAL_MS: "300000", IDLE_CYCLE_INTERVAL_MS: "600000" } },
    { ...common, name: "athena-improvement", env: { ...BASE, SOLDIER_ID: "athena", SOLDIER_NAME: "ATHENA", HEARTBEAT_INTERVAL_MS: "300000", IDLE_CYCLE_INTERVAL_MS: "600000" } },
    { ...common, name: "candor-intel", env: { ...BASE, SOLDIER_ID: "candor", SOLDIER_NAME: "CANDOR", HEARTBEAT_INTERVAL_MS: "300000", IDLE_CYCLE_INTERVAL_MS: "900000" } },
    { ...common, name: "argus-audit", env: { ...BASE, SOLDIER_ID: "argus", SOLDIER_NAME: "ARGUS", HEARTBEAT_INTERVAL_MS: "300000", IDLE_CYCLE_INTERVAL_MS: "600000" } },
  ],
};