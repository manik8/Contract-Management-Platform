'use client'

import { useContract, useTransitionContract } from '@/hooks/use-contracts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
  CONTRACT_STATUSES,
  getNextAllowedStatuses,
  ContractStatus,
} from '@/lib/contract-lifecycle'
import { StatusChangeDropdown } from '@/components/status-change-dropdown'
import { StatusTimeline } from '@/components/status-timeline'

export default function ContractDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const { data: contract, isLoading } = useContract(params.id)
  const transitionMutation = useTransitionContract()

  const handleTransition = async (status: ContractStatus) => {
    if (
      confirm(
        `Are you sure you want to transition this contract to ${CONTRACT_STATUSES[status]}?`
      )
    ) {
      try {
        await transitionMutation.mutateAsync({ id: params.id, status })
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.error ||
          'Failed to transition contract. Check if the transition is allowed.'
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

  if (isLoading) {
    return <div className="text-center py-12">Loading contract...</div>
  }

  if (!contract) {
    return <div className="text-center py-12">Contract not found</div>
  }

  const allowedStatuses = getNextAllowedStatuses(
    contract.status as ContractStatus
  )
  const isLocked = contract.status === 'LOCKED'
  const isRevoked = contract.status === 'REVOKED'

  // Map contract fields to blueprint fields for display
  const fieldMap = new Map(
    contract.fields.map((cf) => [cf.fieldId, cf])
  )
  const blueprintFields = contract.blueprint.fields || []

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {contract.name}
        </h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Contract Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Blueprint</p>
            <p className="font-medium">{contract.blueprint.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span
              className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                contract.status as ContractStatus
              )}`}
            >
              {CONTRACT_STATUSES[contract.status as ContractStatus]}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Created</p>
            <p className="font-medium">
              {format(new Date(contract.createdAt), 'MMM dd, yyyy HH:mm')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="font-medium">
              {format(new Date(contract.updatedAt), 'MMM dd, yyyy HH:mm')}
            </p>
          </div>
        </CardContent>
      </Card>

      {allowedStatuses.length > 0 && !isLocked && !isRevoked && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Change Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <StatusChangeDropdown
                currentStatus={contract.status as ContractStatus}
                allowedStatuses={allowedStatuses}
                onStatusChange={handleTransition}
                isLoading={transitionMutation.isPending}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Contract Fields</CardTitle>
        </CardHeader>
        <CardContent>
          {blueprintFields.length === 0 ? (
            <p className="text-gray-500">No fields defined for this contract.</p>
          ) : (
            <div className="space-y-4">
              {blueprintFields.map((field) => {
                const contractField = fieldMap.get(field.id)
                const value = contractField?.value
                  ? JSON.parse(contractField.value)
                  : null

                return (
                  <div key={field.id} className="border-b border-gray-200 pb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      Type: {field.type}
                      {field.required && (
                        <span className="text-red-500 ml-2">* Required</span>
                      )}
                    </p>
                    {value !== null && value !== undefined ? (
                      <p className="text-gray-900">
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                      </p>
                    ) : (
                      <p className="text-gray-400 italic">Not filled</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <StatusTimeline
        contractId={contract.id}
        currentStatus={contract.status as ContractStatus}
      />
    </div>
  )
}
