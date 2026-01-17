import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createBlueprintSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  fields: z.array(
    z.object({
      type: z.enum(['TEXT', 'DATE', 'SIGNATURE', 'CHECKBOX']),
      label: z.string().min(1),
      positionX: z.number().int().default(0),
      positionY: z.number().int().default(0),
      required: z.boolean().default(false),
    })
  ),
})

export async function GET() {
  try {
    const blueprints = await prisma.blueprint.findMany({
      include: {
        fields: true,
        _count: {
          select: { contracts: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(blueprints)
  } catch (error) {
    console.error('Error fetching blueprints:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blueprints' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createBlueprintSchema.parse(body)

    const blueprint = await prisma.blueprint.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        fields: {
          create: validatedData.fields,
        },
      },
      include: {
        fields: true,
      },
    })

    return NextResponse.json(blueprint, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating blueprint:', error)
    return NextResponse.json(
      { error: 'Failed to create blueprint' },
      { status: 500 }
    )
  }
}
