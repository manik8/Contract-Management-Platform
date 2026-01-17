import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createContractSchema = z.object({
  name: z.string().min(1),
  blueprintId: z.string().min(1),
  fields: z.record(z.string(), z.any()).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const filter = status ? { status: status.toUpperCase() } : {}

    const contracts = await prisma.contract.findMany({
      where: filter,
      include: {
        blueprint: {
          select: {
            id: true,
            name: true,
          },
        },
        fields: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(contracts)
  } catch (error) {
    console.error('Error fetching contracts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contracts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createContractSchema.parse(body)

    // Fetch blueprint with fields
    const blueprint = await prisma.blueprint.findUnique({
      where: { id: validatedData.blueprintId },
      include: { fields: true },
    })

    if (!blueprint) {
      return NextResponse.json(
        { error: 'Blueprint not found' },
        { status: 404 }
      )
    }

    // Create contract with fields
    const contract = await prisma.contract.create({
      data: {
        name: validatedData.name,
        blueprintId: validatedData.blueprintId,
        status: 'CREATED',
        fields: {
          create: blueprint.fields.map((field) => ({
            fieldId: field.id,
            value: validatedData.fields?.[field.id]
              ? JSON.stringify(validatedData.fields[field.id])
              : null,
          })),
        },
      },
      include: {
        blueprint: {
          select: {
            id: true,
            name: true,
          },
        },
        fields: true,
      },
    })

    return NextResponse.json(contract, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating contract:', error)
    return NextResponse.json(
      { error: 'Failed to create contract' },
      { status: 500 }
    )
  }
}
