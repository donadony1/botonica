import React from 'react';
import { ScreenType } from '../types';

interface ToastProps {
  message: string | null;
  onNavigateToCart: () => void;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onNavigateToCart, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#1a1c1c] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10 text-xs md:text-sm">
        <span className="material-symbols-outlined text-[#d4e8d0] text-[20px]">
          check_circle
        </span>
        <span>{message}</span>
        <button
          onClick={onNavigateToCart}
          className="underline text-[#d4e8d0] hover:text-white font-semibold uppercase tracking-wider text-[11px] ml-1"
        >
          Panier →
        </button>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white ml-2 p-1"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    </div>
  );
};
