// Type definitions for Prisma models (since SQLite doesn't support enums)

export type FieldType = 'TEXT' | 'DATE' | 'SIGNATURE' | 'CHECKBOX'

export type ContractStatus =
  | 'CREATED'
  | 'APPROVED'
  | 'SENT'
  | 'SIGNED'
  | 'LOCKED'
  | 'REVOKED'
