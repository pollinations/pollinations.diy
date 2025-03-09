/**
 * Cloudflare Workers Fetch Polyfill
 * 
 * This polyfill patches the global fetch to remove options that are not supported 
 * in the Cloudflare Workers environment, such as 'cache: no-cache'.
 */

export function applyFetchPolyfill() {
  console.log('===============================================');
  console.log('FETCH POLYFILL: Attempting to apply Cloudflare Workers fetch compatibility polyfill');
  console.log('===============================================');
  
  // Only apply in a Cloudflare Workers environment or if we're in a server environment
  if (typeof globalThis !== 'undefined') {
    
    console.log('===============================================');
    console.log('FETCH POLYFILL: Applying fetch compatibility polyfill');
    console.log('===============================================');
    
    // Store the original fetch
    const originalFetch = globalThis.fetch;
    
    // Replace with our patched version
    globalThis.fetch = function patchedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
      // Log all fetch calls
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      console.log(`FETCH POLYFILL: Intercepted fetch call to ${url}`);
      
      // Create a new init object without the unsupported options
      if (init) {
        const patchedInit = { ...init };
        
        // Remove the cache option if present
        if ('cache' in patchedInit) {
          console.log(`FETCH POLYFILL: Removing unsupported cache option: ${patchedInit.cache}`);
          delete patchedInit.cache;
        }
        
        // Remove other potentially problematic options for Cloudflare Workers
        if ('integrity' in patchedInit) {
          console.log('FETCH POLYFILL: Removing unsupported integrity option');
          delete patchedInit.integrity;
        }
        
        if ('keepalive' in patchedInit) {
          console.log('FETCH POLYFILL: Removing unsupported keepalive option');
          delete patchedInit.keepalive;
        }
        
        // Ensure headers are in a format Cloudflare Workers can handle
        if (patchedInit.headers && !(patchedInit.headers instanceof Headers) && typeof patchedInit.headers === 'object') {
          try {
            // Convert to a standard Headers object
            const headers = new Headers();
            Object.entries(patchedInit.headers).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                headers.append(key, value.toString());
              }
            });
            patchedInit.headers = headers;
            console.log('FETCH POLYFILL: Converted headers to Headers object');
          } catch (e) {
            console.error('FETCH POLYFILL: Error converting headers:', e);
          }
        }
        
        console.log('FETCH POLYFILL: Calling original fetch with patched options');
        return originalFetch(input, patchedInit);
      }
      
      console.log('FETCH POLYFILL: Calling original fetch with no init options');
      return originalFetch(input);
    };
    
    console.log('===============================================');
    console.log('FETCH POLYFILL: Fetch function patched for Cloudflare Workers compatibility');
    console.log('===============================================');
  }
}
