import {
  canPerformAction,
  canTransitionStatus,
  ROLE_PERMISSIONS,
  STATUS_ROLE_MAPPING,
  UserRole,
} from '../roles'

describe('Role-based Permissions', () => {
  describe('canPerformAction', () => {
    it('should allow ADMIN to perform all actions', () => {
      expect(canPerformAction('ADMIN', 'create_blueprints')).toBe(true)
      expect(canPerformAction('ADMIN', 'approve_contracts')).toBe(true)
      expect(canPerformAction('ADMIN', 'sign_contracts')).toBe(true)
    })

    it('should allow APPROVER to approve contracts', () => {
      expect(canPerformAction('APPROVER', 'approve_contracts')).toBe(true)
      expect(canPerformAction('APPROVER', 'send_contracts')).toBe(true)
    })

    it('should not allow APPROVER to sign contracts', () => {
      expect(canPerformAction('APPROVER', 'sign_contracts')).toBe(false)
    })

    it('should allow SIGNER to sign contracts', () => {
      expect(canPerformAction('SIGNER', 'sign_contracts')).toBe(true)
      expect(canPerformAction('SIGNER', 'lock_contracts')).toBe(true)
    })

    it('should not allow SIGNER to approve contracts', () => {
      expect(canPerformAction('SIGNER', 'approve_contracts')).toBe(false)
    })

    it('should only allow VIEWER to view', () => {
      expect(canPerformAction('VIEWER', 'view_contracts')).toBe(true)
      expect(canPerformAction('VIEWER', 'create_contracts')).toBe(false)
    })
  })

  describe('canTransitionStatus', () => {
    it('should allow ADMIN to transition to any status', () => {
      expect(canTransitionStatus('ADMIN', 'APPROVED')).toBe(true)
      expect(canTransitionStatus('ADMIN', 'SIGNED')).toBe(true)
      expect(canTransitionStatus('ADMIN', 'LOCKED')).toBe(true)
    })

    it('should allow APPROVER to transition to APPROVED', () => {
      expect(canTransitionStatus('APPROVER', 'APPROVED')).toBe(true)
    })

    it('should not allow APPROVER to transition to SIGNED', () => {
      expect(canTransitionStatus('APPROVER', 'SIGNED')).toBe(false)
    })

    it('should allow SIGNER to transition to SIGNED', () => {
      expect(canTransitionStatus('SIGNER', 'SIGNED')).toBe(true)
      expect(canTransitionStatus('SIGNER', 'LOCKED')).toBe(true)
    })

    it('should not allow SIGNER to transition to APPROVED', () => {
      expect(canTransitionStatus('SIGNER', 'APPROVED')).toBe(false)
    })
  })

  describe('ROLE_PERMISSIONS', () => {
    it('should have correct permissions for each role', () => {
      expect(ROLE_PERMISSIONS.VIEWER).toContain('view_contracts')
      expect(ROLE_PERMISSIONS.APPROVER).toContain('approve_contracts')
      expect(ROLE_PERMISSIONS.SIGNER).toContain('sign_contracts')
      expect(ROLE_PERMISSIONS.ADMIN.length).toBeGreaterThan(
        ROLE_PERMISSIONS.APPROVER.length
      )
    })
  })
})
