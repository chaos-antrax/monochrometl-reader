'use client';
export type ToastKind = 'success' | 'error' | 'info';
export type ToastDetail = { id: string; message: string; kind: ToastKind };
export const TOAST_EVENT = 'monochrome-toast';
export function notify(message: string, kind: ToastKind = 'info') {
  window.dispatchEvent(new CustomEvent<ToastDetail>(TOAST_EVENT, {
    detail: { id: crypto.randomUUID(), message, kind },
  }));
}
