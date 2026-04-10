// api/session-console.js
// Serves session-console.html from private ironbridge-memory repo
// LAW 322 compliant: classified content stays private, served via API

export default async function handler(req, res) {
  const pin = req.query.pin;
  const validPin = process.env.IB_PIN || 'ironbridge2026';
  
  if (pin !== validPin) {
    return res.status(401).send('<!DOCTYPE html><html><body><h1>PIN Required</h1><form><input name="pin" type="password" placeholder="Enter PIN"><button type="submit">Submit</button></form></body></html>');
  }

  const ghToken = process.env.IB_GH_TOKEN;
  if (!ghToken) {
    return res.status(500).send('Server config error: IB_GH_TOKEN not set');
  }

  try {
    const r = await fetch('https://api.github.com/repos/IRONBRIDGE-Al/ironbridge-memory/contents/ops/session-console.html', {
      headers: { 
        Authorization: 'token ' + ghToken,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    const j = await r.json();
    
    if (j.content) {
      const html = Buffer.from(j.content, 'base64').toString('utf8');
      res.setHeader('Content-Type', 'text/html');
      return res.send(html);
    } else {
      return res.status(404).send('Session console not found in private repo');
    }
  } catch (e) {
    return res.status(500).send('Error: ' + e.message);
  }
}
