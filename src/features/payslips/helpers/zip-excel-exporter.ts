import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { exportSalarySlip, PayslipData } from './create-payslip-sheet'

interface ExportPayslipZipOptions {
  data: PayslipData[]
  zipName?: string
  filePrefix?: string
}

export async function exportPayslipZip({
  data,
}: ExportPayslipZipOptions): Promise<void> {
  if (!data || data.length === 0) return

  const zip = new JSZip()

  try {
    for (const item of data) {
      const result = await exportSalarySlip(item)
      const buf = result.buffer
      const uint8 = buf instanceof ArrayBuffer ? new Uint8Array(buf) : buf

      zip.file(result.fileName, uint8, { binary: true })
    }

    const blob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    })

    saveAs(blob, `Phiếu lương_${new Date().toLocaleDateString('vi-VN')}.zip`)
  } catch (err) {
    console.error('Failed to export payslips ZIP', err)
    throw err
  }
}
