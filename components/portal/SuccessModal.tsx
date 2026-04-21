interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export default function SuccessModal({ isOpen, onClose, title, message }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/55 z-[2000] flex items-center justify-center p-5">
      <div className="bg-white rounded-[20px] p-[38px] px-[34px] max-w-[460px] w-full text-center animate-modal-in">
        <div className="w-[70px] h-[70px] bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4.5">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h2 className="font-serif text-[24px] font-black text-brand-slate mb-2">{title}</h2>
        <p className="text-[13.5px] text-brand-muted leading-[1.65] mb-6.5">{message}</p>
        <button 
          onClick={onClose}
          className="text-[13px] font-bold text-white bg-brand-purple border-none px-8 py-3 rounded-lg cursor-pointer inline-flex items-center gap-2 transition-colors hover:bg-brand-purple2"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
