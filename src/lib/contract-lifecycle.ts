import { ContractStatus } from '@/types/prisma'

export type { ContractStatus }

export const CONTRACT_STATUSES: Record<ContractStatus, string> = {
  CREATED: 'Created',
  APPROVED: 'Approved',
  SENT: 'Sent',
  SIGNED: 'Signed',
  LOCKED: 'Locked',
  REVOKED: 'Revoked',
}

export const STATUS_TRANSITIONS: Record<ContractStatus, ContractStatus[]> = {
  CREATED: ['APPROVED', 'REVOKED'],
  APPROVED: ['SENT', 'REVOKED'],
  SENT: ['SIGNED', 'REVOKED'],
  SIGNED: ['LOCKED'],
  LOCKED: [], // Locked contracts cannot transition
  REVOKED: [], // Revoked contracts cannot transition
}

export function canTransition(
  currentStatus: ContractStatus,
  targetStatus: ContractStatus
): boolean {
  // Locked and Revoked contracts cannot transition
  if (currentStatus === 'LOCKED' || currentStatus === 'REVOKED') {
    return false
  }

  return STATUS_TRANSITIONS[currentStatus].includes(targetStatus)
}

export function getNextAllowedStatuses(
  currentStatus: ContractStatus
): ContractStatus[] {
  return STATUS_TRANSITIONS[currentStatus] || []
}
