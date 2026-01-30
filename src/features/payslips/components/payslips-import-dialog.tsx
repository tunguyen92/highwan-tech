import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as XLSX from 'xlsx'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { PayslipData } from '../helpers/create-payslip-sheet'
import { exportPayslipZip } from '../helpers/zip-excel-exporter'

const formSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, {
      message: 'Please upload a file',
    })
    .refine((files) => {
      const f = files?.[0]
      if (!f) return false
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ]
      return (
        allowedTypes.includes(f.type) || f.name?.toLowerCase().endsWith('.xlsx')
      )
    }, 'Please upload xlsx format.'),
})

type PayslipImportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PayslipsImportDialog({
  open,
  onOpenChange,
}: PayslipImportDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { file: undefined },
  })

  const fileRef = form.register('file')

  const onSubmit = () => {
    const file = form.getValues('file')
    if (!file || file.length === 0) return

    const reader = new FileReader()

    reader.onload = () => {
      const result = reader.result
      if (!result) return

      const data = new Uint8Array(result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })

      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      // Ensure headers with empty cells are kept and set to 0 instead of being omitted
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        defval: 0,
      }) as PayslipData[]

      exportPayslipZip({ data: jsonData })
    }

    reader.readAsArrayBuffer(file[0])

    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        form.reset()
      }}
    >
      <DialogContent className='gap-2 sm:max-w-sm'>
        <DialogHeader className='text-start'>
          <DialogTitle>Export Payslips</DialogTitle>
          <DialogDescription>
            Import payslips quickly from a XLSX file.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id='payslip-import-form' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='file'
              render={() => (
                <FormItem className='my-2'>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input
                      type='file'
                      accept='.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
                      {...fileRef}
                      className='h-8 py-0'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className='gap-2'>
          <DialogClose asChild>
            <Button variant='outline'>Close</Button>
          </DialogClose>
          <Button type='submit' form='payslip-import-form'>
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
