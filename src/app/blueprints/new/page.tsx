'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateBlueprint } from '@/hooks/use-blueprints'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useRouter } from 'next/navigation'

const blueprintSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  fields: z
    .array(
      z.object({
        type: z.enum(['TEXT', 'DATE', 'SIGNATURE', 'CHECKBOX']),
        label: z.string().min(1, 'Label is required'),
        positionX: z.number().int().default(0),
        positionY: z.number().int().default(0),
        required: z.boolean().default(false),
      })
    )
    .min(1, 'At least one field is required'),
})

type BlueprintFormData = z.infer<typeof blueprintSchema>

export default function NewBlueprintPage() {
  const router = useRouter()
  const createMutation = useCreateBlueprint()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BlueprintFormData>({
    resolver: zodResolver(blueprintSchema),
    defaultValues: {
      fields: [
        {
          type: 'TEXT',
          label: '',
          positionX: 0,
          positionY: 0,
          required: false,
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fields',
  })

  const onSubmit = async (data: BlueprintFormData) => {
    try {
      await createMutation.mutateAsync(data)
      router.push('/blueprints')
    } catch (error) {
      alert('Failed to create blueprint')
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Create New Blueprint
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Blueprint Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="e.g., Employment Contract"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                {...register('description')}
                placeholder="Optional description"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Fields</CardTitle>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  append({
                    type: 'TEXT',
                    label: '',
                    positionX: 0,
                    positionY: 0,
                    required: false,
                  })
                }
              >
                Add Field
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border border-gray-200 rounded-lg p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900">Field {index + 1}</h3>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Type *</Label>
                    <Select {...register(`fields.${index}.type`)}>
                      <option value="TEXT">Text</option>
                      <option value="DATE">Date</option>
                      <option value="SIGNATURE">Signature</option>
                      <option value="CHECKBOX">Checkbox</option>
                    </Select>
                  </div>

                  <div>
                    <Label>Label *</Label>
                    <Input
                      {...register(`fields.${index}.label`)}
                      placeholder="Field label"
                    />
                    {errors.fields?.[index]?.label && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fields[index]?.label?.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Position X</Label>
                    <Input
                      type="number"
                      {...register(`fields.${index}.positionX`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>

                  <div>
                    <Label>Position Y</Label>
                    <Input
                      type="number"
                      {...register(`fields.${index}.positionY`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center space-x-2">
                      <Checkbox
                        {...register(`fields.${index}.required`)}
                      />
                      <span className="text-sm text-gray-700">Required</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}

            {errors.fields && (
              <p className="text-red-500 text-sm">
                {errors.fields.message || 'At least one field is required'}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creating...' : 'Create Blueprint'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
