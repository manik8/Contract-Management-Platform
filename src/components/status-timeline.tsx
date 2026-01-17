'use client'

import { useContractHistory } from '@/hooks/use-contract-history'
import { CONTRACT_STATUSES, ContractStatus } from '@/lib/contract-lifecycle'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface StatusTimelineProps {
  contractId: string
  currentStatus: ContractStatus
}

export function StatusTimeline({ contractId, currentStatus }: StatusTimelineProps) {
  const { data: history, isLoading } = useContractHistory(contractId)

  const getStatusColor = (status: ContractStatus | string) => {
    switch (status) {
      case 'CREATED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'APPROVED':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'SENT':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'SIGNED':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'LOCKED':
        return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'REVOKED':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-gray-500">Loading timeline...</div>
        </CardContent>
      </Card>
    )
  }

  if (!history || history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-gray-500">
            No status history available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          <div className="space-y-6">
            {/* Current status */}
            <div className="relative flex items-start gap-4">
              <div className="relative z-10 flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${getStatusColor(
                    currentStatus
                  )}`}
                >
                  <div className="w-3 h-3 rounded-full bg-current"></div>
                </div>
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      currentStatus
                    )}`}
                  >
                    {CONTRACT_STATUSES[currentStatus]} (Current)
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Current status
                </p>
              </div>
            </div>

            {/* History items */}
            {history.map((item, index) => (
              <div key={item.id} className="relative flex items-start gap-4">
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${getStatusColor(
                      item.toStatus
                    )}`}
                  >
                    <div className="w-3 h-3 rounded-full bg-current"></div>
                  </div>
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    {item.fromStatus && (
                      <>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            item.fromStatus
                          )}`}
                        >
                          {CONTRACT_STATUSES[item.fromStatus as ContractStatus]}
                        </span>
                        <span className="text-gray-400">→</span>
                      </>
                    )}
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        item.toStatus
                      )}`}
                    >
                      {CONTRACT_STATUSES[item.toStatus as ContractStatus]}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>{format(new Date(item.createdAt), 'MMM dd, yyyy HH:mm:ss')}</p>
                    {item.changedBy && (
                      <p>Changed by: {item.changedBy}</p>
                    )}
                    {item.reason && (
                      <p className="text-gray-600 italic">Reason: {item.reason}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
