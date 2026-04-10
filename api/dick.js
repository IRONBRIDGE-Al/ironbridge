// api/dick.js - Dick Commander on Vercel Edge
// Uses existing env vars: IB_BOT, IB_CHAT_ID, GROQ_API_KEY, UPSTASH_REST_URL, UPSTASH_REST_TOKEN
export const config = { runtime: 'edge' };

export default async function handler(req) {
  const GROQ_KEY = process.env.GROQ_API_KEY;
  const TG_BOT = process.env.IB_BOT;
  const TG_CHAT = process.env.IB_CHAT_ID;
  const UPSTASH_URL = process.env.UPSTASH_REST_URL;
  const UPSTASH_TOKEN = process.env.UPSTASH_REST_TOKEN;

  try {
    // Get pending jobs from Upstash queue
    const jobsRes = await fetch(UPSTASH_URL + '/lrange/ironbridge:dick:jobs/0/10', {
      headers: { 'Authorization': 'Bearer ' + UPSTASH_TOKEN }
    });
    const jobsData = await jobsRes.json();
    const jobs = jobsData.result || [];

    if (jobs.length === 0) {
      // No jobs, just heartbeat
      return new Response(JSON.stringify({ 
        status: 'idle', 
        jobs: 0, 
        time: new Date().toISOString(),
        message: 'Dick Commander ready'
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    // Process first job via Groq
    const job = JSON.parse(jobs[0]);
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + GROQ_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are Dick Commander, orchestrator of IronBridge army. Execute the job concisely and report results.' },
          { role: 'user', content: job.task }
        ],
        max_tokens: 500
      })
    });
    const result = (await groqRes.json()).choices?.[0]?.message?.content || 'No response';

    // Remove processed job from queue
    await fetch(UPSTASH_URL + '/lpop/ironbridge:dick:jobs', {
      method: 'POST', headers: { 'Authorization': 'Bearer ' + UPSTASH_TOKEN }
    });

    // Log job completion to Upstash
    const jobLog = JSON.stringify({ job: job.task, result, time: new Date().toISOString() });
    await fetch(UPSTASH_URL + '/set/ironbridge:dick:lastjob', {
      method: 'POST', headers: { 'Authorization': 'Bearer ' + UPSTASH_TOKEN },
      body: jobLog
    });

    // Telegram alert if urgent
    if (job.urgent) {
      await fetch('https://api.telegram.org/bot' + TG_BOT + '/sendMessage', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TG_CHAT, text: '🎖️ DICK: ' + result.substring(0, 300) })
      });
    }

    return new Response(JSON.stringify({ 
      status: 'processed', 
      job: job.task.substring(0, 50),
      result: result.substring(0, 200),
      time: new Date().toISOString()
    }), { headers: { 'Content-Type': 'application/json' } });

  } catch (e) {
    return new Response(JSON.stringify({ 
      error: e.message,
      time: new Date().toISOString()
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
