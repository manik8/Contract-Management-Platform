import React from 'react'
import { clsx } from 'clsx'

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <select
        className={clsx(
          'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Select.displayName = 'Select'
