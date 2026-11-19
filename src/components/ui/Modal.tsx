"use client";

import React, { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  labelledBy: string;
  maxWidthClass?: string;
  children: React.ReactNode;
}

/**
 * WCAG 2.2 compliant accessible dialog with Escape closing,
 * backdrop click closing, body scroll lock, and focus restoration.
 */
export function Modal({
  isOpen,
  onClose,
  labelledBy,
  maxWidthClass = "max-w-xl",
  children,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Move initial focus inside modal dialog
    const frameId = window.requestAnimationFrame(() => {
      panelRef.current?.focus();
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xl animate-in fade-in duration-200 print:hidden"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`relative w-full ${maxWidthClass} max-h-[90vh] overflow-y-auto rounded-[2rem] visionos-glass-elevated border border-slate-200/80 dark:border-slate-700 shadow-2xl p-6 sm:p-8 outline-hidden`}
      >
        {children}
      </div>
    </div>
  );
}
