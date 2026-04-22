interface StepperProps {
  steps: { id: string; label: string }[];
  currentStep: string;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="flex w-full max-w-brand-portal mx-auto items-center mt-6">
      {steps.map((step, index) => {
        const isActive = index <= currentIndex;
        const isPast = index < currentIndex;
        
        return (
          <div key={step.id} className="flex items-center flex-1 relative last:flex-none">
            <div
              className={`w-[34px] h-[34px] rounded-full shrink-0 flex items-center justify-center text-[13px] font-bold transition-all duration-300 z-10 
              ${isActive ? 'bg-brand-purple text-white shadow-[0_0_0_4px_rgba(75,29,121,0.2)]' : 'bg-brand-bg text-brand-muted border-2 border-brand-border'}`}
            >
              {isPast ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            
            <div className="absolute top-[40px] left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold text-brand-muted hidden sm:block">
              {step.label}
            </div>

            {index < steps.length - 1 && (
              <div className={`flex-1 h-[2px] mx-2 ${isActive ? 'bg-brand-purple' : 'bg-brand-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
