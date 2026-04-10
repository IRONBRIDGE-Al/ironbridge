// api/upstash.js - Secure Upstash Redis Proxy
export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);
  const cmd = url.searchParams.get('cmd'); // get, set, lpush, lpop, lrange
  const key = url.searchParams.get('key');
  
  if (!cmd || !key) {
    return new Response(JSON.stringify({ error: 'cmd and key required' }), { status: 400 });
  }

  const UPSTASH_URL = process.env.UPSTASH_REST_URL;
  const UPSTASH_TOKEN = process.env.UPSTASH_REST_TOKEN;

  try {
    let endpoint = UPSTASH_URL + '/' + cmd + '/' + key;
    let method = 'GET';
    let body = null;

    if (req.method === 'POST') {
      method = 'POST';
      body = await req.text();
    }

    if (cmd === 'lrange') {
      const start = url.searchParams.get('start') || '0';
      const end = url.searchParams.get('end') || '10';
      endpoint = UPSTASH_URL + '/lrange/' + key + '/' + start + '/' + end;
    }

    const res = await fetch(endpoint, {
      method,
      headers: { 'Authorization': 'Bearer ' + UPSTASH_TOKEN },
      body
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), { 
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
