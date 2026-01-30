import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import * as XLSX from 'xlsx'
import { exportSalarySlip } from './create-payslip-sheet'
import { PayslipData } from './create-payslip-sheet'

interface ExportPayslipZipOptions {
  data: PayslipData[]
  zipName?: string
  filePrefix?: string
}

function sanitizeFilename(name: string, fallback = 'file') {
  const sanitized = name
    .replace(/\.[^/.]+$/, '')
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
    .replace(/\s+/g, '_')
    .trim()

  return sanitized.length ? sanitized.slice(0, 100) : fallback
}

export async function exportPayslipZip({
  data,
  zipName = 'Payslips',
  filePrefix = 'Payslip',
}: ExportPayslipZipOptions): Promise<void> {
  if (!data || data.length === 0) return

  const zip = new JSZip()

  try {
    exportSalarySlip(data[0])

    // for (const item of data) {
    //   const workbook = XLSX.utils.book_new()
    //   const sheet = createPayslipSheet(item)

    //   XLSX.utils.book_append_sheet(workbook, sheet, 'Payslip')

    //   const buf = XLSX.write(workbook, {
    //     bookType: 'xlsx',
    //     type: 'array',
    //   }) as ArrayBuffer | Uint8Array

    //   const uint8 = buf instanceof ArrayBuffer ? new Uint8Array(buf) : buf

    //   const safeName = sanitizeFilename(String(item.name || 'unknown'))
    //   zip.file(`${filePrefix}_${safeName}.xlsx`, uint8, { binary: true })
    // }

    // const blob = await zip.generateAsync({
    //   type: 'blob',
    //   compression: 'DEFLATE',
    //   compressionOptions: { level: 6 },
    // })

    // saveAs(blob, `${zipName}.zip`)
  } catch (err) {
    console.error('Failed to export payslips ZIP', err)
    throw err
  }
}
