'use client'

import { useBlueprints, useDeleteBlueprint } from '@/hooks/use-blueprints'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format } from 'date-fns'

export default function BlueprintsPage() {
  const { data: blueprints, isLoading } = useBlueprints()
  const deleteMutation = useDeleteBlueprint()

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blueprint?')) {
      try {
        await deleteMutation.mutateAsync(id)
      } catch (error) {
        alert('Failed to delete blueprint')
      }
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Blueprints</h1>
        <Link href="/blueprints/new">
          <Button>Create Blueprint</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading blueprints...</div>
      ) : !blueprints || blueprints.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            No blueprints found. Create a blueprint to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blueprints.map((blueprint) => (
            <Card key={blueprint.id}>
              <CardHeader>
                <CardTitle>{blueprint.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {blueprint.description && (
                  <p className="text-sm text-gray-600 mb-4">
                    {blueprint.description}
                  </p>
                )}
                <div className="text-sm text-gray-500 mb-4">
                  <p>Fields: {blueprint.fields.length}</p>
                  <p>
                    Created: {format(new Date(blueprint.createdAt), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/blueprints/${blueprint.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      View
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(blueprint.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
