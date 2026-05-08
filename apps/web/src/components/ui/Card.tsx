import { forwardRef, type HTMLAttributes } from 'react'

export type CardProps = HTMLAttributes<HTMLDivElement>

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          'rounded-lg border border-slate-200 bg-white p-5 text-slate-950 shadow-sm shadow-slate-200/70',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
    )
  },
)

Card.displayName = 'Card'
