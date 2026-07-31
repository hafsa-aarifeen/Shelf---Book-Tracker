import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
  variant?: 'danger' | 'default';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onClose,
  variant = 'danger',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-[#FBF8F2] border border-[#E4DBC9] rounded-2xl max-w-md w-full p-6 shadow-xl text-[#3F382F] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#857B6D] hover:text-[#3F382F] p-1 rounded-full hover:bg-[#F4EEE3] transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              variant === 'danger'
                ? 'bg-[#F8ECEC] text-[#8C3A3A] border border-[#E5B8B8]'
                : 'bg-[#F4EEE3] text-[#B98A5E] border border-[#E4DBC9]'
            }`}
          >
            {variant === 'danger' ? <Trash2 size={20} /> : <AlertTriangle size={20} />}
          </div>

          <div className="flex-1 min-w-0 pr-4">
            <h3 className="font-serif-title font-bold text-lg text-[#3F382F] mb-1">
              {title}
            </h3>
            <div className="text-sm text-[#857B6D] leading-relaxed">
              {message}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#E4DBC9]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#D1C7B7] bg-[#F4EEE3] text-xs font-semibold text-[#5C5449] hover:bg-[#E4DBC9] transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer shadow-xs ${
              variant === 'danger'
                ? 'bg-[#8C3A3A] hover:bg-[#6D2B2B]'
                : 'bg-[#B98A5E] hover:bg-[#9A6B52]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
