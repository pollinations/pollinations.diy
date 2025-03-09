import type { LoaderFunction } from '@remix-run/cloudflare';

export const loader: LoaderFunction = async ({ context, request }) => {
  // Get all environment variables from context.cloudflare.env
  const cloudflareEnv = context?.cloudflare?.env as Record<string, any> || {};
  
  // Create a safe version that doesn't expose full API keys
  const safeEnv: Record<string, string> = {};
  
  for (const key in cloudflareEnv) {
    const value = cloudflareEnv[key];
    // If this looks like an API key, only show first/last few chars
    if (typeof value === 'string' && (key.includes('KEY') || key.includes('TOKEN'))) {
      safeEnv[key] = value ? 
        `${value.substring(0, 4)}...${value.substring(value.length - 4)}` : 
        'null';
    } else {
      safeEnv[key] = typeof value === 'string' ? value : JSON.stringify(value);
    }
  }
  
  // Add process.env keys too (for local development)
  for (const key in process.env) {
    if (!safeEnv[key]) {
      const value = process.env[key];
      if (typeof value === 'string' && (key.includes('KEY') || key.includes('TOKEN'))) {
        safeEnv[key] = value ? 
          `${value.substring(0, 4)}...${value.substring(value.length - 4)}` : 
          'null';
      } else {
        safeEnv[key] = typeof value === 'string' ? value : JSON.stringify(value);
      }
    }
  }
  
  // Log info to server logs
  console.log('DEBUG ENV VARIABLES:', JSON.stringify(safeEnv, null, 2));
  
  return Response.json({
    env: safeEnv,
    processEnvKeys: Object.keys(process.env),
    cloudflareEnvKeys: Object.keys(cloudflareEnv),
    openaiLikeApiKey: cloudflareEnv['OPENAI_LIKE_API_KEY'] ? 'exists' : 'missing',
    openaiLikeApiBaseUrl: cloudflareEnv['OPENAI_LIKE_API_BASE_URL'] ? 'exists' : 'missing'
  });
};
