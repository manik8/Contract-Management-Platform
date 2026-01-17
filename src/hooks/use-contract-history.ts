import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api-client'

export interface ContractStatusHistory {
  id: string
  contractId: string
  fromStatus: string | null
  toStatus: string
  changedBy: string | null
  reason: string | null
  createdAt: string
}

export function useContractHistory(contractId: string) {
  return useQuery<ContractStatusHistory[]>({
    queryKey: ['contracts', contractId, 'history'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/contracts/${contractId}/history`)
      return data
    },
    enabled: !!contractId,
  })
}
