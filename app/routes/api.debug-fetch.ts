import { json } from '@remix-run/cloudflare';
import type { LoaderFunctionArgs } from '@remix-run/cloudflare';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');
  
  if (!targetUrl) {
    return json({ error: 'No URL provided' }, { status: 400 });
  }

  try {
    console.log(`Debug fetch: Attempting to fetch ${targetUrl}`);
    
    // Create a simple headers object
    const headers = new Headers();
    
    // Add authorization if provided
    const auth = url.searchParams.get('auth');
    if (auth) {
      headers.append('Authorization', `Bearer ${auth}`);
    }
    
    // Use a minimal fetch request
    const response = await fetch(targetUrl, { 
      method: 'GET',
      headers: headers
    });

    const status = response.status;
    const statusText = response.statusText;
    const responseHeaders = Object.fromEntries([...response.headers.entries()]);
    
    let responseBody;
    try {
      responseBody = await response.json();
    } catch (e) {
      responseBody = { error: 'Could not parse response as JSON' };
    }

    return json({
      success: true,
      request: {
        url: targetUrl,
        headers: Object.fromEntries(headers.entries())
      },
      response: {
        status,
        statusText,
        headers: responseHeaders,
        body: responseBody
      }
    });
  } catch (error: any) {
    console.error('Debug fetch error:', error);
    
    return json({
      success: false,
      error: {
        message: error.message || 'Unknown error',
        name: error.name || 'Error',
        stack: error.stack || 'No stack trace available'
      }
    }, { status: 500 });
  }
}
