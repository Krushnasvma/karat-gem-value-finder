import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-proxy-target',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const targetHeader = req.headers.get('x-proxy-target');
    const targetUrl = targetHeader === 'backend' 
      ? Deno.env.get('HIDDEN_PROJECT_BACKEND_URL')
      : Deno.env.get('HIDDEN_PROJECT_URL');

    if (!targetUrl) {
      return new Response(
        JSON.stringify({ error: 'Proxy configuration missing' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the path from the request
    const url = new URL(req.url);
    const path = url.pathname.replace('/secure-proxy', '');
    const queryString = url.search;

    // Construct the full target URL
    const fullTargetUrl = `${targetUrl}${path}${queryString}`;

    // Forward the request
    const proxyReq = new Request(fullTargetUrl, {
      method: req.method,
      headers: {
        ...Object.fromEntries(req.headers.entries()),
        'X-Forwarded-For': req.headers.get('x-forwarded-for') || 'unknown',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    });

    // Remove headers that shouldn't be forwarded
    proxyReq.headers.delete('host');
    proxyReq.headers.delete('x-proxy-target');

    const response = await fetch(proxyReq);
    
    // Copy response headers and add CORS
    const responseHeaders = new Headers(response.headers);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      responseHeaders.set(key, value);
    });

    // Remove revealing headers
    responseHeaders.delete('server');
    responseHeaders.delete('x-powered-by');
    responseHeaders.set('X-Content-Type-Options', 'nosniff');
    responseHeaders.set('X-Frame-Options', 'SAMEORIGIN');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Proxy request failed' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
