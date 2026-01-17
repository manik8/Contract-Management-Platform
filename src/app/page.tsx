'use client'

import { useState } from 'react'
import { useContracts } from '@/hooks/use-contracts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import Link from 'next/link'
import { format } from 'date-fns'
import {
  CONTRACT_STATUSES,
  getNextAllowedStatuses,
  ContractStatus,
} from '@/lib/contract-lifecycle'
import { useTransitionContract } from '@/hooks/use-contracts'
import { StatusChangeDropdown } from '@/components/status-change-dropdown'

export default function Dashboard() {
  const [filter, setFilter] = useState<string>('')
  const { data: contracts, isLoading } = useContracts(filter || undefined)
  const transitionMutation = useTransitionContract()

  const handleTransition = async (contractId: string, status: ContractStatus) => {
    if (
      confirm(
        `Are you sure you want to transition this contract to ${CONTRACT_STATUSES[status]}?`
      )
    ) {
      try {
        await transitionMutation.mutateAsync({ id: contractId, status })
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.error || 'Failed to transition contract'
        alert(errorMessage)
      }
    }
  }

  const getStatusColor = (status: ContractStatus) => {
    switch (status) {
      case 'CREATED':
        return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED':
        return 'bg-blue-100 text-blue-800'
      case 'SENT':
        return 'bg-purple-100 text-purple-800'
      case 'SIGNED':
        return 'bg-green-100 text-green-800'
      case 'LOCKED':
        return 'bg-gray-100 text-gray-800'
      case 'REVOKED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Contracts Dashboard</h1>
        <Link href="/contracts/new">
          <Button>Create Contract</Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All Contracts</option>
              <option value="CREATED">Created</option>
              <option value="APPROVED">Approved</option>
              <option value="SENT">Sent</option>
              <option value="SIGNED">Signed</option>
              <option value="LOCKED">Locked</option>
              <option value="REVOKED">Revoked</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center py-12">Loading contracts...</div>
      ) : !contracts || contracts.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            No contracts found. Create a contract to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blueprint
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contracts.map((contract) => {
                const allowedStatuses = getNextAllowedStatuses(contract.status as ContractStatus)
                return (
                  <tr key={contract.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {contract.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contract.blueprint.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          contract.status as ContractStatus
                        )}`}
                      >
                        {CONTRACT_STATUSES[contract.status as ContractStatus]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(contract.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link href={`/contracts/${contract.id}`}>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </Link>
                        <StatusChangeDropdown
                          currentStatus={contract.status as ContractStatus}
                          allowedStatuses={allowedStatuses}
                          onStatusChange={(status) =>
                            handleTransition(contract.id, status)
                          }
                          isLoading={transitionMutation.isPending}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
