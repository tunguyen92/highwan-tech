import { MailPlus, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useInvoices } from './invoices-provider'

export function InvoicesPrimaryButtons() {
  const { setOpen } = useInvoices()
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('invite')}
      >
        <span>Invite Invoice</span> <MailPlus size={18} />
      </Button>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add Invoice</span> <UserPlus size={18} />
      </Button>
    </div>
  )
}
