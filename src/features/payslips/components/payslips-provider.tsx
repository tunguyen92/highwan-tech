import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Payslip } from '../data/schema'

type PayslipsDialogType = 'create' | 'update' | 'delete' | 'import'

type PayslipsContextType = {
  open: PayslipsDialogType | null
  setOpen: (str: PayslipsDialogType | null) => void
  currentRow: Payslip | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Payslip | null>>
}

const PayslipsContext = React.createContext<PayslipsContextType | null>(null)

export function PayslipsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<PayslipsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Payslip | null>(null)

  return (
    <PayslipsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </PayslipsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePayslips = () => {
  const payslipsContext = React.useContext(PayslipsContext)

  if (!payslipsContext) {
    throw new Error('usePayslips has to be used within <PayslipsContext>')
  }

  return payslipsContext
}
