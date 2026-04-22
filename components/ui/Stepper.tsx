interface StepperProps {
  steps: { id: string; label: string }[];
  currentStep: string;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="w-full bg-white border-b border-brand-border px-4 md:px-[var(--px)] pt-4 sm:pt-5 pb-6 sm:pb-7">
      <div className="max-w-brand-portal mx-auto">
        <div className="flex items-start w-full">
          {steps.map((step, index) => {
            const isActive = index <= currentIndex;
            const isPast = index < currentIndex;

            return (
              <div key={step.id} className="flex-1 flex flex-col items-center relative">
                {/* Connector line BEFORE the circle (except first) */}
                {index > 0 && (
                  <div
                    className={`absolute top-[17px] right-[50%] w-full h-[2px] ${
                      isActive ? 'bg-brand-purple' : 'bg-brand-border'
                    }`}
                  />
                )}

                {/* Circle */}
                <div
                  className={`relative z-10 w-[34px] h-[34px] rounded-full shrink-0 flex items-center justify-center text-[13px] font-bold transition-all duration-300
                  ${isActive
                    ? 'bg-brand-purple text-white shadow-[0_0_0_4px_rgba(75,29,121,0.15)]'
                    : 'bg-brand-bg text-brand-muted border-2 border-brand-border'
                  }`}
                >
                  {isPast ? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Label — shown below circle, only from sm up */}
                <div className={`mt-2 text-[10px] font-semibold text-center hidden sm:block ${isActive ? 'text-brand-purple' : 'text-brand-muted'}`}>
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
