// /api/deploy-webhook.js
// Railway calls this on every deploy event
// Posts to Command Center Redis + TG alert
// LAW: after every redeploy, CC is notified and owner is alerted

const https = require('https');

function tg(msg) {
  const bot = process.env.IB_BOT;
  const chat = process.env.IB_CHAT_ID;
  if (!bot || !chat) return;
  const text = encodeURIComponent(msg);
  const req = https.request({
    hostname: 'api.telegram.org',
    path: '/bot' + bot + '/sendMessage?chat_id=' + chat + '&text=' + text,
    method: 'GET'
  }, () => {});
  req.on('error', () => {});
  req.end();
}

function upstashSet(key, value) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return Promise.resolve();
  return fetch(url + '/set/' + encodeURIComponent(key) + '/' + encodeURIComponent(JSON.stringify(value)), {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token }
  }).catch(() => {});
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'deploy-webhook active' });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' });
  }

  try {
    const body = req.body || {};
    const serviceName = body.service?.name || body.serviceName || 'unknown';
    const status = body.status || body.deployment?.status || 'UNKNOWN';
    const deployId = body.deployment?.id || body.deploymentId || 'unknown';
    const commitMsg = body.deployment?.meta?.commitMessage || body.commitMessage || '';
    const ts = new Date().toISOString();

    const entry = {
      service: serviceName,
      status: status,
      deployId: deployId,
      commitMsg: commitMsg.substring(0, 100),
      ts: ts
    };

    // Write to Redis for Command Center
    await upstashSet('ironbridge:deploy:latest:' + serviceName, entry);
    await upstashSet('ironbridge:deploy:log:' + ts, entry);

    // Alert owner via TG
    const emoji = status === 'SUCCESS' ? 'ok' : status === 'FAILED' ? 'x' : 'hourglass';
    const msg = '[DEPLOY ' + status + '] ' + serviceName + '\n' +
      'Commit: ' + commitMsg.substring(0, 80) + '\n' +
      'ID: ' + deployId.substring(0, 12) + '\n' +
      'Time: ' + ts;
    tg(msg);

    // Also store in CC deploy log
    await upstashSet('ironbridge:cc:deploy-log', {
      recent: entry,
      updated: ts
    });

    return res.status(200).json({ ok: true, logged: entry });
  } catch (err) {
    tg('[DEPLOY WEBHOOK ERROR] ' + err.message);
    return res.status(500).json({ error: err.message });
  }
}