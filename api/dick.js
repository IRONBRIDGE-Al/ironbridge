// api/dick.js - Dick Commander on Vercel Edge
export const config = { runtime: 'edge' };

export default async function handler(req) {
  const GROQ_KEY = process.env.GROQ_API_KEY;
  const TG_BOT = process.env.TELEGRAM_BOT_TOKEN;
  const TG_CHAT = process.env.TELEGRAM_CHAT_ID;
  const UPSTASH_URL = process.env.UPSTASH_REST_URL;
  const UPSTASH_TOKEN = process.env.UPSTASH_REST_TOKEN;

  try {
    const jobsRes = await fetch(UPSTASH_URL + '/lrange/ironbridge:dick:jobs/0/10', {
      headers: { 'Authorization': 'Bearer ' + UPSTASH_TOKEN }
    });
    const jobsData = await jobsRes.json();
    const jobs = jobsData.result || [];

    if (jobs.length === 0) {
      return new Response(JSON.stringify({ status: 'idle', jobs: 0, time: new Date().toISOString() }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const job = JSON.parse(jobs[0]);
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + GROQ_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are Dick Commander. Execute the job concisely.' },
          { role: 'user', content: job.task }
        ],
        max_tokens: 500
      })
    });
    const result = (await groqRes.json()).choices?.[0]?.message?.content || 'No response';

    await fetch(UPSTASH_URL + '/lpop/ironbridge:dick:jobs', {
      method: 'POST', headers: { 'Authorization': 'Bearer ' + UPSTASH_TOKEN }
    });

    await fetch(UPSTASH_URL + '/set/ironbridge:dick:lastjob', {
      method: 'POST', headers: { 'Authorization': 'Bearer ' + UPSTASH_TOKEN },
      body: JSON.stringify({ job: job.task, result, time: new Date().toISOString() })
    });

    if (job.urgent) {
      await fetch('https://api.telegram.org/bot' + TG_BOT + '/sendMessage', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TG_CHAT, text: '🎖️ DICK: ' + result.substring(0, 300) })
      });
    }

    return new Response(JSON.stringify({ status: 'done', result: result.substring(0, 100) }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
