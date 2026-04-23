'use client';

export default function ActionAlert({ message, isVisible }: { message: string, isVisible: boolean }) {
  if (!isVisible) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-8 duration-300">
      <div className="bg-white/90 backdrop-blur-xl border border-rose-200 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
        <div className="bg-rose-100 p-2 rounded-full">
          <span className="text-rose-600 text-lg">🗑️</span>
        </div>
        <p className="font-bold text-slate-800 text-sm">{message}</p>
      </div>
    </div>
  );
}