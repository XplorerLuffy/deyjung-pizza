export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };
  return (
    <div className={`${sizes[size]} rounded-full bg-primary/20 animate-pulse-slow flex items-center justify-center`}>
      <div className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-5 h-5' : 'w-8 h-8'} rounded-full bg-primary animate-pulse`} />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <Spinner size="lg" />
      <p className="text-charcoal-mid text-sm font-medium">Loading...</p>
    </div>
  );
}
