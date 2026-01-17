import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const history = await prisma.contractStatusHistory.findMany({
      where: { contractId: params.id },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(history)
  } catch (error) {
    console.error('Error fetching status history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch status history' },
      { status: 500 }
    )
  }
}
