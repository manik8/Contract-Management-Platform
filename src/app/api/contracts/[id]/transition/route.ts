import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  canTransition,
  getNextAllowedStatuses,
} from '@/lib/contract-lifecycle'
import {
  canTransitionStatus,
  getCurrentUser,
  STATUS_ROLE_MAPPING,
} from '@/lib/roles'
import { ContractStatus } from '@/types/prisma'
import { z } from 'zod'

const transitionSchema = z.object({
  status: z.enum(['CREATED', 'APPROVED', 'SENT', 'SIGNED', 'LOCKED', 'REVOKED']),
  reason: z.string().optional(),
  userId: z.string().optional(), // For role-based checks
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, reason, userId } = transitionSchema.parse(body)
    
    // Get current user (mock for now)
    const user = getCurrentUser()
    
    // Check role-based permissions
    if (!canTransitionStatus(user.role, status)) {
      return NextResponse.json(
        {
          error: `Your role (${user.role}) does not have permission to transition to ${status}`,
          requiredRoles: STATUS_ROLE_MAPPING[status] || [],
        },
        { status: 403 }
      )
    }

    const contract = await prisma.contract.findUnique({
      where: { id: params.id },
    })

    if (!contract) {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      )
    }

    // Check if transition is allowed
    const currentStatus = contract.status as ContractStatus
    const targetStatus = status as ContractStatus

    if (!canTransition(currentStatus, targetStatus)) {
      const allowedStatuses = getNextAllowedStatuses(currentStatus)
      return NextResponse.json(
        {
          error: `Invalid transition from ${contract.status} to ${status}`,
          currentStatus: contract.status,
          allowedStatuses,
        },
        { status: 400 }
      )
    }

    // Update contract status and create history entry
    const updatedContract = await prisma.contract.update({
      where: { id: params.id },
        data: {
          status: targetStatus,
          statusHistory: {
            create: {
              fromStatus: currentStatus,
              toStatus: targetStatus,
              changedBy: user.name,
              reason: reason || null,
            },
          },
        },
      include: {
        blueprint: {
          select: {
            id: true,
            name: true,
          },
        },
        statusHistory: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    })

    return NextResponse.json(updatedContract)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error transitioning contract:', error)
    return NextResponse.json(
      { error: 'Failed to transition contract' },
      { status: 500 }
    )
  }
}
