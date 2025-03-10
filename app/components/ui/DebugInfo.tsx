import { useEffect, useState } from 'react';

interface DebugInfoResponse {
  apiBaseUrl: string;
}

export function DebugInfo() {
  const [apiBaseUrl, setApiBaseUrl] = useState<string | null>(null);

  useEffect(() => {
    // This will run only on the client side
    const fetchApiInfo = async () => {
      try {
        const response = await fetch('/api/debug-info');
        const data = await response.json() as DebugInfoResponse;
        setApiBaseUrl(data.apiBaseUrl);
      } catch (error) {
        console.error('Failed to fetch debug info:', error);
      }
    };

    fetchApiInfo();
  }, []);

  if (!apiBaseUrl) return null;

  return (
    <div className="fixed bottom-4 left-4 text-xs bg-black/50 text-white px-2 py-1 rounded z-50 font-mono">
      API: {apiBaseUrl}
    </div>
  );
}