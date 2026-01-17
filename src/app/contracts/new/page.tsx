'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateContract } from '@/hooks/use-contracts'
import { useBlueprints } from '@/hooks/use-blueprints'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useRouter, useSearchParams } from 'next/navigation'
import { useBlueprint } from '@/hooks/use-blueprints'

const contractSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  blueprintId: z.string().min(1, 'Blueprint is required'),
})

type ContractFormData = z.infer<typeof contractSchema>

export default function NewContractPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const createMutation = useCreateContract()
  const { data: blueprints } = useBlueprints()
  const blueprintIdFromQuery = searchParams.get('blueprintId') || ''
  const [selectedBlueprintId, setSelectedBlueprintId] = useState<string>(blueprintIdFromQuery)
  const { data: blueprint } = useBlueprint(selectedBlueprintId)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      blueprintId: blueprintIdFromQuery,
    },
  })

  useEffect(() => {
    if (blueprintIdFromQuery) {
      setValue('blueprintId', blueprintIdFromQuery)
      setSelectedBlueprintId(blueprintIdFromQuery)
    }
  }, [blueprintIdFromQuery, setValue])

  const [fieldValues, setFieldValues] = useState<Record<string, any>>({})

  const onSubmit = async (data: ContractFormData) => {
    try {
      await createMutation.mutateAsync({
        ...data,
        fields: fieldValues,
      })
      router.push('/')
    } catch (error) {
      alert('Failed to create contract')
    }
  }

  const handleFieldChange = (fieldId: string, value: any) => {
    setFieldValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Create New Contract
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Contract Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Contract Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="e.g., Employment Contract - John Doe"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="blueprintId">Blueprint *</Label>
              <Select
                id="blueprintId"
                {...register('blueprintId')}
                onChange={(e) => {
                  setValue('blueprintId', e.target.value)
                  setSelectedBlueprintId(e.target.value)
                  setFieldValues({})
                }}
              >
                <option value="">Select a blueprint</option>
                {blueprints?.map((bp) => (
                  <option key={bp.id} value={bp.id}>
                    {bp.name}
                  </option>
                ))}
              </Select>
              {errors.blueprintId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.blueprintId.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {blueprint && blueprint.fields.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Contract Fields</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {blueprint.fields.map((field) => (
                <div key={field.id}>
                  <Label>
                    {field.label}
                    {field.required && <span className="text-red-500"> *</span>}
                  </Label>
                  {field.type === 'TEXT' && (
                    <Input
                      value={fieldValues[field.id] || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      required={field.required}
                    />
                  )}
                  {field.type === 'DATE' && (
                    <Input
                      type="date"
                      value={fieldValues[field.id] || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      required={field.required}
                    />
                  )}
                  {field.type === 'CHECKBOX' && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={fieldValues[field.id] || false}
                        onChange={(e) =>
                          handleFieldChange(field.id, e.target.checked)
                        }
                      />
                      <span className="text-sm text-gray-700">
                        {field.label}
                      </span>
                    </div>
                  )}
                  {field.type === 'SIGNATURE' && (
                    <div>
                      <Input
                        placeholder="Enter signature or upload file"
                        value={fieldValues[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        required={field.required}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Note: In a production system, this would handle file uploads
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creating...' : 'Create Contract'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
