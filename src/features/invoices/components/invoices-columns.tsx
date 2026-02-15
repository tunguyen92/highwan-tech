import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type Invoice } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const invoicesColumns: ColumnDef<Invoice>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-0.5'
      />
    ),
    meta: {
      className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-0.5'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'nbmst',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Mã số thuế người bán' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36 ps-3'>{row.getValue('nbmst')}</LongText>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'nbten',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tên người bán' />
    ),
    cell: ({ row }) => {
      return <LongText>{row.getValue('nbten')}</LongText>
    },
    meta: { className: 'w-36' },
  },
  {
    accessorKey: 'shdon',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Số hóa đơn' />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>{row.getValue('shdon')}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'tdlap',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ngày lập hóa đơn' />
    ),
    cell: ({ row }) => <div>{row.getValue('tdlap')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'tgtcthue',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tổng tiền trước thuế' />
    ),
    cell: ({ row }) => {
      return (
        <LongText className='max-w-36'>{row.getValue('tgtcthue')}</LongText>
      )
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'tgtthue',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tổng tiền thuế' />
    ),
    cell: ({ row }) => {
      return <LongText className='max-w-36'>{row.getValue('tgtthue')}</LongText>
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'tgtttbso',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tổng tiền thanh toán' />
    ),
    cell: ({ row }) => {
      return (
        <LongText className='max-w-36'>{row.getValue('tgtttbso')}</LongText>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
