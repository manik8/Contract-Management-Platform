'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { CONTRACT_STATUSES, ContractStatus } from '@/lib/contract-lifecycle'
import { clsx } from 'clsx'

interface StatusChangeDropdownProps {
  currentStatus: ContractStatus
  allowedStatuses: ContractStatus[]
  onStatusChange: (status: ContractStatus) => void
  isLoading?: boolean
}

export function StatusChangeDropdown({
  currentStatus,
  allowedStatuses,
  onStatusChange,
  isLoading = false,
}: StatusChangeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleStatusClick = (status: ContractStatus) => {
    onStatusChange(status)
    setIsOpen(false)
  }

  if (allowedStatuses.length === 0) {
    return null
  }

  const getStatusConfig = (status: ContractStatus) => {
    switch (status) {
      case 'APPROVED':
        return {
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ),
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          borderColor: 'border-blue-200',
        }
      case 'SENT':
        return {
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          ),
          color: 'text-purple-600',
          bgColor: 'hover:bg-purple-50',
          borderColor: 'border-purple-200',
        }
      case 'SIGNED':
        return {
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          ),
          color: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          borderColor: 'border-green-200',
        }
      case 'LOCKED':
        return {
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ),
          color: 'text-gray-600',
          bgColor: 'hover:bg-gray-50',
          borderColor: 'border-gray-200',
        }
      case 'REVOKED':
        return {
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ),
          color: 'text-red-600',
          bgColor: 'hover:bg-red-50',
          borderColor: 'border-red-200',
        }
      default:
        return {
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          ),
          color: 'text-gray-600',
          bgColor: 'hover:bg-gray-50',
          borderColor: 'border-gray-200',
        }
    }
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="min-w-[140px] flex justify-center items-center"
      >
        <span className="text-sm">Change Status</span>
        <svg
          className={clsx(
            'ml-2 h-4 w-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-64 rounded-lg shadow-lg bg-white border border-gray-200 z-50 overflow-hidden">
          <div className="py-1.5" role="menu">
            <div className="px-3 py-2 mb-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Transition to
              </span>
            </div>
            <div className="border-t border-gray-100">
              {allowedStatuses.map((status, index) => {
                const config = getStatusConfig(status)
                return (
                  <button
                    key={status}
                    onClick={() => handleStatusClick(status)}
                    className={clsx(
                      'w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-150',
                      config.bgColor,
                      config.color,
                      index !== allowedStatuses.length - 1 && 'border-b border-gray-100'
                    )}
                    role="menuitem"
                  >
                    <div className={clsx('flex-shrink-0', config.color)}>
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">
                        {CONTRACT_STATUSES[status]}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {currentStatus} → {status}
                      </div>
                    </div>
                    <svg
                      className="w-4 h-4 text-gray-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
