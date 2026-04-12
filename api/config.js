// /api/config.js -- Vercel Edge Function
// SECURITY LAW: ONLY return PIN for login.
// NEVER return BOT tokens, CHAT_ID, or GH_TOKEN to browser.
// All sensitive operations happen SERVER-SIDE via dedicated API routes.

export const config = { runtime: 'edge' };

export default function handler(req) {
    const cfg = {
          PIN: process.env.IB_PIN || ''
    };
    return new Response(
          'window.__IB__ = ' + JSON.stringify(cfg) + ';',
      { headers: { 'Content-Type': 'application/javascript', 'Cache-Control': 'no-store' } }
        );
}
