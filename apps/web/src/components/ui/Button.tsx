import { forwardRef, type ButtonHTMLAttributes } from 'react'

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

const buttonVariants = {
  primary: 'bg-blue-600 text-white shadow-sm hover:bg-blue-700',
  secondary: 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50',
  ghost: 'text-slate-700 hover:bg-slate-100 hover:text-slate-950',
  danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700',
} as const

const buttonSizes = {
  sm: 'h-8 px-3',
  md: 'h-10 px-4',
  lg: 'h-11 px-5',
} as const

type ButtonVariant = keyof typeof buttonVariants
type ButtonSize = keyof typeof buttonSizes

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      type = 'button',
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={[buttonBase, buttonVariants[variant], buttonSizes[size], className]
          .filter(Boolean)
          .join(' ')}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
        ) : null}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
