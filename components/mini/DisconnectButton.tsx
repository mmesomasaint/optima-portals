'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { disconnectNotion } from '@/app/dashboard/integrations/actions';
import { ConfirmModal } from '@/components/mini/ConfirmModal';

export default function DisconnectButton() {
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const executeDisconnect = async () => {
    setIsDisconnecting(true);
    setErrorMsg('');
    
    const result = await disconnectNotion();
    
    if (result.error) {
      setErrorMsg(result.error);
      setIsDisconnecting(false);
      setShowModal(false);
    } else {
      // Force Next.js to re-render the server page, revealing the "Connect" button
      router.refresh(); 
    }
  };

  return (
    <>
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-xs">
          <AlertCircle className="w-4 h-4" />
          {errorMsg}
        </div>
      )}
      
      <button 
        onClick={() => setShowModal(true)}
        disabled={isDisconnecting}
        className="w-full py-3.5 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isDisconnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Disconnect Workspace'}
      </button>

      <ConfirmModal 
        isOpen={showModal}
        title="Disconnect Notion"
        message="Are you sure you want to disconnect your Notion workspace? The AI will not be able to deploy new architectures until you reconnect it."
        confirmText="Yes, Disconnect"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={isDisconnecting}
        onConfirm={executeDisconnect}
        onCancel={() => setShowModal(false)}
      />
    </>
  );
}