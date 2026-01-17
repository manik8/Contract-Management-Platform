export type UserRole = 'VIEWER' | 'APPROVER' | 'SIGNER' | 'ADMIN'

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  VIEWER: ['view_contracts', 'view_blueprints'],
  APPROVER: [
    'view_contracts',
    'view_blueprints',
    'approve_contracts',
    'revoke_contracts',
    'send_contracts',
  ],
  SIGNER: [
    'view_contracts',
    'view_blueprints',
    'sign_contracts',
    'lock_contracts',
  ],
  ADMIN: [
    'view_contracts',
    'view_blueprints',
    'create_blueprints',
    'delete_blueprints',
    'create_contracts',
    'approve_contracts',
    'revoke_contracts',
    'send_contracts',
    'sign_contracts',
    'lock_contracts',
    'update_contracts',
  ],
}

export const STATUS_ROLE_MAPPING: Record<string, UserRole[]> = {
  APPROVED: ['APPROVER', 'ADMIN'],
  REVOKED: ['APPROVER', 'ADMIN'],
  SENT: ['APPROVER', 'ADMIN'],
  SIGNED: ['SIGNER', 'ADMIN'],
  LOCKED: ['SIGNER', 'ADMIN'],
}

export function canPerformAction(
  role: UserRole,
  action: string
): boolean {
  const permissions = ROLE_PERMISSIONS[role] || []
  return permissions.includes(action)
}

export function canTransitionStatus(
  role: UserRole,
  targetStatus: string
): boolean {
  const allowedRoles = STATUS_ROLE_MAPPING[targetStatus] || []
  return allowedRoles.includes(role) || role === 'ADMIN'
}

// Mock user for now (in production, get from session/auth)
export function getCurrentUser(): { id: string; role: UserRole; name: string } {
  // TODO: Replace with actual authentication
  return {
    id: 'system',
    role: 'ADMIN', // Default to admin for now
    name: 'System User',
  }
}
