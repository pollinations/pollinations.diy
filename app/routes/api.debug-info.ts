import { json } from '@remix-run/cloudflare';

export async function loader({ context }: { context: { cloudflare?: { env: Record<string, string> } } }) {
  // Try to get the API base URL from different sources
  let apiBaseUrl = 'Not set';
  
  // 1. Try from Cloudflare context (production)
  if (context.cloudflare?.env?.OPENAI_LIKE_API_BASE_URL) {
    apiBaseUrl = context.cloudflare.env.OPENAI_LIKE_API_BASE_URL;
  } 
  // 2. Try from process.env (development)
  else if (typeof process !== 'undefined' && process.env?.OPENAI_LIKE_API_BASE_URL) {
    apiBaseUrl = process.env.OPENAI_LIKE_API_BASE_URL;
  }
  // 3. Fallback to the value from .env file
  else {
    apiBaseUrl = 'https://text.pollinations.ai/openai';
  }
  
  return json({
    apiBaseUrl
  });
}