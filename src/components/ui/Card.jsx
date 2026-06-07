import { cn } from '@/lib/utils';

export function Card({ className, ...props }) {
  return (
    <div
      className={cn('rounded-lg border p-6 shadow-sm', className)}
      style={{ backgroundColor: '#0d0d1a', borderColor: '#1a2332' }}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('flex flex-col space-y-1.5 pb-6', className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return (
    <h2 className={cn('text-2xl font-semibold leading-none tracking-tight', className)} {...props} />
  );
}

export function CardDescription({ className, ...props }) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn('pt-0', className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return <div className={cn('flex items-center pt-6', className)} {...props} />;
}
