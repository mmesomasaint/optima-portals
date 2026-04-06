'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { disconnectNotion } from './actions';

export default function DisconnectButton() {
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const router = useRouter();

  const handleDisconnect = async () => {
    // Add a quick safety prompt so they don't click it by accident
    if (!window.confirm("Are you sure you want to disconnect your Notion workspace? The AI will not be able to deploy new architectures.")) return;

    setIsDisconnecting(true);
    
    const result = await disconnectNotion();
    
    if (result.error) {
      alert(`Error: ${result.error}`);
      setIsDisconnecting(false);
    } else {
      // Force Next.js to re-render the server page, revealing the "Connect" button
      router.refresh(); 
    }
  };

  return (
    <button 
      onClick={handleDisconnect}
      disabled={isDisconnecting}
      className="w-full py-3.5 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
    >
      {isDisconnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Disconnect Workspace'}
    </button>
  );
}