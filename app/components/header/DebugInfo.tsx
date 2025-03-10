import { useStore } from '@nanostores/react';
import { isDebugMode } from '~/lib/stores/settings';

interface DebugInfoProps {
  apiBaseUrl?: string;
}

export function DebugInfo({ apiBaseUrl }: DebugInfoProps) {
  const debugMode = useStore(isDebugMode);

  if (!debugMode) {
    return null;
  }

  return (
    <div className="text-xs text-pollinations-diy-elements-textSecondary px-2 py-1 bg-pollinations-diy-elements-bgSecondary rounded">
      <span className="font-mono">API: {apiBaseUrl || 'Not set'}</span>
    </div>
  );
}