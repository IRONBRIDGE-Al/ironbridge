import { Redis } from '@upstash/redis';
const redis = new Redis({ url: process.env.UPSTASH_REST_URL, token: process.env.UPSTASH_REST_TOKEN });
const REQUIRED_DOCS = ['railway','coolify','upstash','vercel','cloudflare','arweave','gemini','github','telegram'];
export default async function handler(req, res) {
  const docs = await redis.get('ironbridge:docs:verified');
  if (!docs) return res.status(403).json({ blocked: true, reason: 'DOCS_NOT_VERIFIED' });
  const missing = REQUIRED_DOCS.filter(d => !docs[d]);
  if (missing.length) return res.status(403).json({ blocked: true, reason: 'DOCS_INCOMPLETE', missing });
  await redis.lpush('ironbridge:audit:actions', JSON.stringify({ ts: new Date().toISOString(), url: req.url }));
  return res.status(200).json({ gate: 'PASSED' });
}