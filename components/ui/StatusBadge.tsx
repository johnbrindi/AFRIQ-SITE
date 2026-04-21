interface StatusBadgeProps {
  status: 'open' | 'hot' | 'dl';
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const configs = {
    open: { label: 'ADMISSION OPEN', classes: 'bg-green-500/15 text-green-500' },
    hot: { label: 'TRENDING', classes: 'bg-brand-gold2/20 text-brand-gold2' },
    dl: { label: 'DEADLINE SOON', classes: 'bg-red-500/15 text-red-400' },
  };

  const config = configs[status];

  return (
    <div className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${config.classes} ${className}`}>
      {config.label}
    </div>
  );
}
