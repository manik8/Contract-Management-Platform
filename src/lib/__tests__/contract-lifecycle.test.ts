import {
  canTransition,
  getNextAllowedStatuses,
  CONTRACT_STATUSES,
  STATUS_TRANSITIONS,
} from '../contract-lifecycle'
import { ContractStatus } from '@/types/prisma'

describe('Contract Lifecycle', () => {
  describe('canTransition', () => {
    it('should allow CREATED to APPROVED', () => {
      expect(canTransition('CREATED', 'APPROVED')).toBe(true)
    })

    it('should allow CREATED to REVOKED', () => {
      expect(canTransition('CREATED', 'REVOKED')).toBe(true)
    })

    it('should allow APPROVED to SENT', () => {
      expect(canTransition('APPROVED', 'SENT')).toBe(true)
    })

    it('should allow SENT to SIGNED', () => {
      expect(canTransition('SENT', 'SIGNED')).toBe(true)
    })

    it('should allow SIGNED to LOCKED', () => {
      expect(canTransition('SIGNED', 'LOCKED')).toBe(true)
    })

    it('should not allow CREATED to SIGNED', () => {
      expect(canTransition('CREATED', 'SIGNED')).toBe(false)
    })

    it('should not allow LOCKED to any status', () => {
      expect(canTransition('LOCKED', 'APPROVED')).toBe(false)
      expect(canTransition('LOCKED', 'SENT')).toBe(false)
    })

    it('should not allow REVOKED to any status', () => {
      expect(canTransition('REVOKED', 'APPROVED')).toBe(false)
      expect(canTransition('REVOKED', 'SENT')).toBe(false)
    })
  })

  describe('getNextAllowedStatuses', () => {
    it('should return correct statuses for CREATED', () => {
      const allowed = getNextAllowedStatuses('CREATED')
      expect(allowed).toEqual(['APPROVED', 'REVOKED'])
    })

    it('should return correct statuses for APPROVED', () => {
      const allowed = getNextAllowedStatuses('APPROVED')
      expect(allowed).toEqual(['SENT', 'REVOKED'])
    })

    it('should return correct statuses for SENT', () => {
      const allowed = getNextAllowedStatuses('SENT')
      expect(allowed).toEqual(['SIGNED', 'REVOKED'])
    })

    it('should return correct statuses for SIGNED', () => {
      const allowed = getNextAllowedStatuses('SIGNED')
      expect(allowed).toEqual(['LOCKED'])
    })

    it('should return empty array for LOCKED', () => {
      const allowed = getNextAllowedStatuses('LOCKED')
      expect(allowed).toEqual([])
    })

    it('should return empty array for REVOKED', () => {
      const allowed = getNextAllowedStatuses('REVOKED')
      expect(allowed).toEqual([])
    })
  })

  describe('CONTRACT_STATUSES', () => {
    it('should have all status mappings', () => {
      expect(CONTRACT_STATUSES.CREATED).toBe('Created')
      expect(CONTRACT_STATUSES.APPROVED).toBe('Approved')
      expect(CONTRACT_STATUSES.SENT).toBe('Sent')
      expect(CONTRACT_STATUSES.SIGNED).toBe('Signed')
      expect(CONTRACT_STATUSES.LOCKED).toBe('Locked')
      expect(CONTRACT_STATUSES.REVOKED).toBe('Revoked')
    })
  })
})
