'use client'

import { useBlueprint } from '@/hooks/use-blueprints'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import Link from 'next/link'

export default function BlueprintDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const { data: blueprint, isLoading } = useBlueprint(params.id)

  if (isLoading) {
    return <div className="text-center py-12">Loading blueprint...</div>
  }

  if (!blueprint) {
    return <div className="text-center py-12">Blueprint not found</div>
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{blueprint.name}</h1>
        <div className="flex gap-2">
          <Link href={`/contracts/new?blueprintId=${blueprint.id}`}>
            <Button>Create Contract</Button>
          </Link>
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Blueprint Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {blueprint.description && (
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="font-medium">{blueprint.description}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">Created</p>
            <p className="font-medium">
              {format(new Date(blueprint.createdAt), 'MMM dd, yyyy HH:mm')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fields Count</p>
            <p className="font-medium">{blueprint.fields.length}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fields</CardTitle>
        </CardHeader>
        <CardContent>
          {blueprint.fields.length === 0 ? (
            <p className="text-gray-500">No fields defined.</p>
          ) : (
            <div className="space-y-4">
              {blueprint.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">
                      Field {index + 1}: {field.label}
                    </h3>
                    {field.required && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        Required
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Type</p>
                      <p className="font-medium">{field.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Position</p>
                      <p className="font-medium">
                        ({field.positionX}, {field.positionY})
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
