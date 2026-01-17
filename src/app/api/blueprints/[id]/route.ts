import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blueprint = await prisma.blueprint.findUnique({
      where: { id: params.id },
      include: {
        fields: {
          orderBy: [{ positionY: 'asc' }, { positionX: 'asc' }],
        },
      },
    })

    if (!blueprint) {
      return NextResponse.json(
        { error: 'Blueprint not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(blueprint)
  } catch (error) {
    console.error('Error fetching blueprint:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blueprint' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.blueprint.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting blueprint:', error)
    return NextResponse.json(
      { error: 'Failed to delete blueprint' },
      { status: 500 }
    )
  }
}
