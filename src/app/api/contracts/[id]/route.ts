import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contract = await prisma.contract.findUnique({
      where: { id: params.id },
      include: {
        blueprint: {
          include: {
            fields: true,
          },
        },
        fields: true,
      },
    })

    if (!contract) {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(contract)
  } catch (error) {
    console.error('Error fetching contract:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contract' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { fields } = body

    // Check if contract is locked
    const existingContract = await prisma.contract.findUnique({
      where: { id: params.id },
    })

    if (!existingContract) {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      )
    }

    if (existingContract.status === 'LOCKED') {
      return NextResponse.json(
        { error: 'Cannot update locked contract' },
        { status: 400 }
      )
    }

    // Update contract fields
    if (fields) {
      await Promise.all(
        Object.entries(fields).map(([fieldId, value]) =>
          prisma.contractField.updateMany({
            where: {
              contractId: params.id,
              fieldId,
            },
            data: {
              value: value ? JSON.stringify(value) : null,
            },
          })
        )
      )
    }

    const updatedContract = await prisma.contract.findUnique({
      where: { id: params.id },
      include: {
        blueprint: {
          include: {
            fields: true,
          },
        },
        fields: true,
      },
    })

    return NextResponse.json(updatedContract)
  } catch (error) {
    console.error('Error updating contract:', error)
    return NextResponse.json(
      { error: 'Failed to update contract' },
      { status: 500 }
    )
  }
}
