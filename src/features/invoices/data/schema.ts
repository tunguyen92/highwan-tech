import { z } from 'zod'

const invoiceStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('invited'),
  z.literal('suspended'),
])
export type InvoiceStatus = z.infer<typeof invoiceStatusSchema>

const invoiceRoleSchema = z.union([
  z.literal('superadmin'),
  z.literal('admin'),
  z.literal('cashier'),
  z.literal('manager'),
])

const invoiceSchema = z.object({
  nbmst: z.string(),
  nbten: z.string(),
  shdon: z.string(),
  tdlap: z.string(),
  tgtcthue: z.string(),
  tgtthue: z.string(),
  tgtttbso: z.string(),
})
export type Invoice = z.infer<typeof invoiceSchema>

export const invoiceListSchema = z.array(invoiceSchema)
