import { json } from '@remix-run/cloudflare';

export async function loader() {
  return json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Health check endpoint'
  });
}