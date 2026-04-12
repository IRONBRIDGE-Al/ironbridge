import { Redis } from '@upstash/redis';
const redis = new Redis({
  url: process.env.UPSTASH_REST_URL,
  token: process.env.UPSTASH_REST_TOKEN,
});
export default async function handler(req, res) {
  const pin = req.headers['x-pin'] || req.query.pin;
  if (pin !== process.env.IB_PIN) return res.status(401).json({ error: 'unauthorized' });
  const [brief, laws, decrees, docs] = await Promise.all([
    redis.get('ironbridge:thanos:brief'),
    redis.get('ironbridge:laws:full'),
    redis.get('ironbridge:decrees:full'),
    redis.get('ironbridge:docs:verified'),
  ]);
  if (!docs) return res.status(403).json({ error: 'DOCS_NOT_VERIFIED', action: 'Read all 9 integration docs first' });
  return res.status(200).json({ brief, laws, decrees, docsVerified: docs, status: 'THANOS ONLINE' });
}