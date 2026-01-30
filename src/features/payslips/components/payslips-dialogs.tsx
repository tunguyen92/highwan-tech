import { showSubmittedData } from '@/lib/show-submitted-data'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { PayslipsImportDialog } from './payslips-import-dialog'
import { PayslipsMutateDrawer } from './payslips-mutate-drawer'
import { usePayslips } from './payslips-provider'

export function PayslipsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = usePayslips()
  return (
    <>
      <PayslipsMutateDrawer
        key='payslip-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      <PayslipsImportDialog
        key='payslips-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <PayslipsMutateDrawer
            key={`payslip-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key='payslip-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
              showSubmittedData(
                currentRow,
                'The following payslip has been deleted:'
              )
            }}
            className='max-w-md'
            title={`Delete this payslip: ${currentRow.id} ?`}
            desc={
              <>
                You are about to delete a payslip with the ID{' '}
                <strong>{currentRow.id}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
          />
        </>
      )}
    </>
  )
}
