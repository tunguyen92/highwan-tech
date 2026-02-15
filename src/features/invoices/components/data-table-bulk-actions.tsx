import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2, UserX, UserCheck, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type Invoice } from '../data/schema'
import { InvoicesMultiDeleteDialog } from './invoices-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    const selectedInvoices = selectedRows.map((row) => row.original as Invoice)
    toast.promise(sleep(2000), {
      loading: `${status === 'active' ? 'Activating' : 'Deactivating'} invoices...`,
      success: () => {
        table.resetRowSelection()
        return `${status === 'active' ? 'Activated' : 'Deactivated'} ${selectedInvoices.length} invoice${selectedInvoices.length > 1 ? 's' : ''}`
      },
      error: `Error ${status === 'active' ? 'activating' : 'deactivating'} invoices`,
    })
    table.resetRowSelection()
  }

  const handleBulkInvite = () => {
    const selectedInvoices = selectedRows.map((row) => row.original as Invoice)
    toast.promise(sleep(2000), {
      loading: 'Inviting invoices...',
      success: () => {
        table.resetRowSelection()
        return `Invited ${selectedInvoices.length} invoice${selectedInvoices.length > 1 ? 's' : ''}`
      },
      error: 'Error inviting invoices',
    })
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='invoice'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={handleBulkInvite}
              className='size-8'
              aria-label='Invite selected invoices'
              title='Invite selected invoices'
            >
              <Mail />
              <span className='sr-only'>Invite selected invoices</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Invite selected invoices</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('active')}
              className='size-8'
              aria-label='Activate selected invoices'
              title='Activate selected invoices'
            >
              <UserCheck />
              <span className='sr-only'>Activate selected invoices</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Activate selected invoices</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('inactive')}
              className='size-8'
              aria-label='Deactivate selected invoices'
              title='Deactivate selected invoices'
            >
              <UserX />
              <span className='sr-only'>Deactivate selected invoices</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Deactivate selected invoices</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Delete selected invoices'
              title='Delete selected invoices'
            >
              <Trash2 />
              <span className='sr-only'>Delete selected invoices</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected invoices</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <InvoicesMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}
