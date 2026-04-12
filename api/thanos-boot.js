// api/thanos-boot.js - IronBridge Thanos Boot Endpoint
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REST_URL,
  token: process.env.UPSTASH_REST_TOKEN,
});

export default async function handler(req, res) {
  const pin = req.headers['x-pin'] || req.query.pin;
  if (pin !== process.env.IB_PIN) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  try {
    const [brief, laws, decrees, constitution, army, docs] = await Promise.all([
      redis.get('ironbridge:thanos:brief'),
      redis.get('ironbridge:laws:full'),
      redis.get('ironbridge:decrees:full'),
      redis.get('ironbridge:constitution'),
      redis.get('ironbridge:army:status'),
      redis.get('ironbridge:docs:verified'),
    ]);

    return res.status(200).json({
      brief: brief || {},
      laws: laws || [],
      decrees: decrees || [],
      constitution: constitution || '',
      army: army || {},
      docsVerified: docs || false,
      timestamp: new Date().toISOString(),
      status: 'THANOS ONLINE',
    });
  } catch (error) {
    return res.status(500).json({ error: 'boot_failed', message: error.message });
  }
}