'use client';

import { Loader2, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#050505] border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-[0_0_40px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDestructive ? 'bg-red-500/10 border border-red-500/20' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
            <AlertTriangle className={`w-5 h-5 ${isDestructive ? 'text-red-400' : 'text-emerald-500'}`} />
          </div>
          <h3 className="text-lg font-medium text-white">{title}</h3>
        </div>
        
        <p className="text-sm text-zinc-400 font-light mb-8 leading-relaxed">
          {message}
        </p>
        
        <div className="flex items-center gap-3 w-full">
          <button 
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-3 bg-white/5 border border-white/10 text-white text-sm font-medium rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${
              isDestructive 
                ? 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20' 
                : 'bg-emerald-500 text-black hover:bg-emerald-400'
            }`}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : confirmText}
          </button>
        </div>

      </div>
    </div>
  );
}