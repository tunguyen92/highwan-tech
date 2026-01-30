import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

export interface PayslipData {
  company: string
  month: string
  period: string
  name: string
  birthday?: string
  department: string
}

export const exportSalarySlip = async (employee: any) => {
  console.log(employee)

  const workbook = new ExcelJS.Workbook()

  // Load template
  const url = '/documents/payslip.xlsx'
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(
      `Failed to fetch payslip template ${url}: ${response.status} ${response.statusText}`
    )
  }

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('text/html')) {
    // Likely a 404 HTML page returned instead of the XLSX file
    throw new Error(
      `Payslip template fetch returned HTML (likely 404). URL: ${url}`
    )
  }

  const buffer = await response.arrayBuffer()
  try {
    await workbook.xlsx.load(buffer)
  } catch (err) {
    throw new Error(
      `Failed to load template as XLSX — ensure ${url} exists and is a valid .xlsx file: ${err}`
    )
  }

  const sheet = workbook.getWorksheet(1) // first sheet

  if (!sheet) {
    throw new Error(
      'Payslip template worksheet not found (expected first sheet)'
    )
  }

  // FILL DATA INTO EXACT CELLS
  // Normalize and pad current month/year
  const monthNum = parseInt(String(employee.month), 10)
  const yearNum = parseInt(String(employee.year), 10)
  const currMonthStr = String(monthNum).padStart(2, '0')
  const currYearStr = String(yearNum)

  // Compute previous month/year correctly across year boundaries
  const currentDate = new Date(yearNum, Math.max(0, monthNum - 1))
  const prevDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1
  )
  const prevMonthStr = String(prevDate.getMonth() + 1).padStart(2, '0')
  const prevYearStr = String(prevDate.getFullYear())

  sheet.getCell('C2').value =
    `BẢNG LƯƠNG CÁ NHÂN THÁNG ${currMonthStr}/${currYearStr}`
  sheet.getCell('C3').value =
    `Từ/From 26/${prevMonthStr}/${prevYearStr} đến/to 25/${currMonthStr}/${currYearStr}`
  sheet.getCell('D4').value = employee['Họ và tên']
  sheet.getCell('D5').value = employee['Ngày sinh']
  sheet.getCell('D6').value = employee['Chức vụ']

  sheet.getCell('E10').value = employee['Số ngày làm việc thực tế (ngày)']
  sheet.getCell('E11').value = employee['Nghỉ lễ, kết hôn, tang chế']
  sheet.getCell('E12').value = employee['Họ và tên']
  sheet.getCell('E13').value = employee['Họ và tên']

  // Export
  const excelBuffer = await workbook.xlsx.writeBuffer()
  saveAs(
    new Blob([excelBuffer]),
    `Phiếu lương ${employee['Họ và tên']}_${employee.month}/${employee.year}.xlsx`
  )
}
