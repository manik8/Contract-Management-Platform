import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/lib/api-client'
import { ContractStatus } from '@/types/prisma'

export interface ContractField {
  id: string
  fieldId: string
  value: string | null
}

export interface Contract {
  id: string
  name: string
  blueprintId: string
  blueprint: {
    id: string
    name: string
  }
  status: ContractStatus
  fields: ContractField[]
  createdAt: string
  updatedAt: string
}

export interface CreateContractInput {
  name: string
  blueprintId: string
  fields?: Record<string, any>
}

export function useContracts(status?: string) {
  return useQuery<Contract[]>({
    queryKey: ['contracts', status],
    queryFn: async () => {
      const params = status ? { status } : {}
      const { data } = await apiClient.get('/contracts', { params })
      return data
    },
  })
}

export function useContract(id: string) {
  return useQuery<Contract>({
    queryKey: ['contracts', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/contracts/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useCreateContract() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateContractInput) => {
      const { data } = await apiClient.post('/contracts', input)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
    },
  })
}

export function useUpdateContract() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      fields,
    }: {
      id: string
      fields: Record<string, any>
    }) => {
      const { data } = await apiClient.patch(`/contracts/${id}`, { fields })
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
      queryClient.invalidateQueries({ queryKey: ['contracts', variables.id] })
    },
  })
}

export function useTransitionContract() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string
      status: ContractStatus
    }) => {
      const { data } = await apiClient.post(`/contracts/${id}/transition`, {
        status,
      })
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
      queryClient.invalidateQueries({ queryKey: ['contracts', variables.id] })
    },
  })
}
