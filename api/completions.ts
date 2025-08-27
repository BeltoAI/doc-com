// Vercel Edge Function proxying to your 8007 box
export const config = { runtime: 'edge' };

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS')
    return new Response(null, { status: 204, headers: CORS });

  if (req.method !== 'POST')
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: CORS
    });

  try {
    const body = await req.text(); // pass JSON through unchanged
    const upstream = await fetch('http://minibelto.duckdns.org:8007/v1/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    });
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { 'content-type': 'application/json', ...CORS }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'Upstream error', detail: String(e) }), {
      status: 502,
      headers: CORS
    });
  }
}
