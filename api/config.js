// /api/config.js -- Vercel Edge Function
// Injects IronBridge runtime config into window.__IB__
// Tokens live in Vercel env vars. Never in source. Never in repo.
// Set these at vercel.com > ironbridge project > Settings > Env Vars:
//   IB_PIN, IB_BOT, IB_CHAT_ID, IB_GH_TOKEN

export const config = { runtime: 'edge' };

export default function handler(req) {
  const cfg = {
    PIN:      process.env.IB_PIN      || '',
    BOT:      process.env.IB_BOT      || '',
    CHAT_ID:  process.env.IB_CHAT_ID  || '',
    GH_TOKEN: process.env.IB_GH_TOKEN || ''
  };
  return new Response(
    'window.__IB__ = ' + JSON.stringify(cfg) + ';',
    { headers: { 'Content-Type': 'application/javascript', 'Cache-Control': 'no-store' } }
  );
}