import { ReactNode, forwardRef, HTMLAttributes } from 'react';

interface BentoCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

const BentoCard = forwardRef<HTMLDivElement, BentoCardProps>(
  function BentoCard({ children, className = '', ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={`glass-card p-6 md:p-8 flex overflow-hidden ${className}`}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

export default BentoCard;
