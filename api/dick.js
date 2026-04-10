export const config = { runtime: 'edge' };

export default function handler(req) {
  return new Response(JSON.stringify({ok:true,v:'dick-v10',method:req.method}), {
    headers: {'Content-Type':'application/json'}
  });
}
