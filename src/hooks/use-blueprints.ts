import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/lib/api-client'

export interface BlueprintField {
  id?: string
  type: 'TEXT' | 'DATE' | 'SIGNATURE' | 'CHECKBOX'
  label: string
  positionX: number
  positionY: number
  required?: boolean
}

export interface Blueprint {
  id: string
  name: string
  description?: string
  fields: BlueprintField[]
  createdAt: string
  updatedAt: string
}

export interface CreateBlueprintInput {
  name: string
  description?: string
  fields: BlueprintField[]
}

export function useBlueprints() {
  return useQuery<Blueprint[]>({
    queryKey: ['blueprints'],
    queryFn: async () => {
      const { data } = await apiClient.get('/blueprints')
      return data
    },
  })
}

export function useBlueprint(id: string) {
  return useQuery<Blueprint>({
    queryKey: ['blueprints', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/blueprints/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useCreateBlueprint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateBlueprintInput) => {
      const { data } = await apiClient.post('/blueprints', input)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blueprints'] })
    },
  })
}

export function useDeleteBlueprint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/blueprints/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blueprints'] })
    },
  })
}
