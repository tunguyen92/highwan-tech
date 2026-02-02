import ExcelJS from 'exceljs'

export interface PayslipData {
  STT: number
  'Họ và tên': string
  'Giới tính': string
  'Chức vụ': string
  'Ngày sinh': string
  'Căn cước/CMND': number
  SĐT: string
  'STK SACOMBANK': string
  'Lương cơ bản': number
  'Hỗ trợ tiền điện thoại': number
  'Tăng ca 150%/ OT 150%': number
  'Tăng ca 200%/ OT 200%': number
  'Tăng ca 300%/ OT 300%': number
  'Tăng ca 210%/ OT 210%': number
  'Tăng ca 270%/ OT 270%': number
  'Tăng ca 390%/ OT 390%': number
  'Hỗ trợ xăng xe, nhà ở': number
  'Tiền cơm trưa': number
  'Tiền cơm Tăng ca/2 tiếng': number
  'Tiền cơm Tăng ca/3 tiếng': number
  'BHXH 8%': number
  'BHYT 1.5%': number
  'BHTN 1%': number
  'Số ngày làm việc trong tháng': number
  'Số ngày làm việc thực tế (ngày)': number
  'Số ngày tăng ca/2 tiếng': number
  'Số ngày tăng ca/3, 4 tiếng': number
  'Nghỉ lễ, kết hôn, tang chế': number
  'Nghỉ ốm, Thai sản': number
  'Nghỉ không lương': number
  'Nghỉ phép năm': number
  'Số ngày cơm trưa': number
  'Tổng tiền cơm trưa': number
  'Tổng tiền tăng ca': number
  'Tổng tiền cơm tăng ca': number
  'Tiền điện thoại': number
  'National Holiday Fee': number
  'Monthly Off Fee (1 Day)': number
  'Processing Fee': number
  'Thưởng tết 2026 (Bonus 2026)': number
  'Tổng lương CB+PC': number
  'TỔNG THU NHẬP': number
  'BẢN THÂN VÀ NGƯỜI PHỤ THUỘC (4.400.000/1 NGƯỜI)': number
  'THU NHẬP CHỊU THUẾ': number
  'THU NHẬP TÍNH THUẾ': number
  'Tổng BHXH': number
  'Công đoàn': number | null
  'THUẾ TNCN': number
  'Tổng lương thực lãnh': number
  month: string
  year: string
}

/* ---------------------------------- */
/* Row engine                          */
/* ---------------------------------- */

type CellValue = keyof PayslipData | ((e: PayslipData) => number | string)

interface RowConfig {
  col: string
  value: CellValue
}

function fillSection(
  sheet: ExcelJS.Worksheet,
  employee: PayslipData,
  startRow: number,
  rows: RowConfig[]
) {
  let row = startRow

  rows.forEach(({ col, value }) => {
    const cellValue =
      typeof value === 'function' ? value(employee) : employee[value]

    sheet.getCell(`${col}${row}`).value = cellValue
    row++
  })
}

/* ---------------------------------- */
/* Section definitions                 */
/* ---------------------------------- */

const SALARY_ROWS: RowConfig[] = [
  { col: 'E', value: 'Số ngày làm việc trong tháng' },
  { col: 'E', value: 'Nghỉ lễ, kết hôn, tang chế' },
  { col: 'E', value: 'Nghỉ phép năm' },
  { col: 'E', value: 'Nghỉ ốm, Thai sản' },
  { col: 'E', value: 'Nghỉ không lương' },
  { col: 'E', value: 'Số ngày làm việc thực tế (ngày)' },
  { col: 'E', value: 'Tăng ca 150%/ OT 150%' },
  { col: 'E', value: 'Tăng ca 200%/ OT 200%' },
  { col: 'E', value: 'Tăng ca 300%/ OT 300%' },
  { col: 'E', value: 'Tăng ca 210%/ OT 210%' },
  { col: 'E', value: 'Tăng ca 270%/ OT 270%' },
  { col: 'E', value: 'Tăng ca 390%/ OT 390%' },
  { col: 'E', value: 'Lương cơ bản' },
  { col: 'E', value: 'Hỗ trợ xăng xe, nhà ở' },
  {
    col: 'E',
    value: (e) =>
      ((e['Lương cơ bản'] + e['Hỗ trợ xăng xe, nhà ở']) *
        e['Số ngày làm việc thực tế (ngày)']) /
      e['Số ngày làm việc trong tháng'],
  },
]

const ALLOWANCE_ROWS: RowConfig[] = [
  { col: 'E', value: 'Tiền điện thoại' },
  { col: 'E', value: 'Tổng tiền tăng ca' },
  { col: 'E', value: 'Tổng tiền cơm tăng ca' },
  { col: 'E', value: 'Tổng tiền cơm trưa' },
  { col: 'E', value: 'Monthly Off Fee (1 Day)' },
  { col: 'E', value: 'National Holiday Fee' },
  { col: 'E', value: 'Processing Fee' },
  { col: 'E', value: 'Thưởng tết 2026 (Bonus 2026)' },
  {
    col: 'E',
    value: (e) =>
      e['Tiền điện thoại'] +
      e['Tổng tiền tăng ca'] +
      e['Tổng tiền cơm tăng ca'] +
      e['Tổng tiền cơm trưa'] +
      e['Monthly Off Fee (1 Day)'] +
      e['National Holiday Fee'] +
      e['Processing Fee'] +
      e['Thưởng tết 2026 (Bonus 2026)'],
  },
]

const DEDUCTION_ROWS: RowConfig[] = [
  { col: 'E', value: 'Tổng BHXH' },
  { col: 'E', value: 'Công đoàn' },
  { col: 'E', value: 'THUẾ TNCN' },
  {
    col: 'E',
    value: (e) => e['Tổng BHXH'] + e['THUẾ TNCN'],
  },
  { col: 'E', value: 'Tổng lương thực lãnh' },
]

/* ---------------------------------- */
/* Export function                     */
/* ---------------------------------- */

export const exportSalarySlip = async (
  employee: PayslipData
): Promise<{ buffer: ArrayBuffer | Uint8Array; fileName: string }> => {
  const workbook = new ExcelJS.Workbook()

  const response = await fetch('/documents/payslip.xlsx')
  if (!response.ok) throw new Error('Payslip template not found')

  await workbook.xlsx.load(await response.arrayBuffer())

  const sheet = workbook.getWorksheet(1)
  if (!sheet) throw new Error('Worksheet missing')

  const month = String(employee.month).padStart(2, '0')
  const year = employee.year

  sheet.getCell('C2').value = `BẢNG LƯƠNG CÁ NHÂN THÁNG ${month}/${year}`
  sheet.getCell('D4').value = employee['Họ và tên']
  sheet.getCell('D5').value = employee['Ngày sinh']
  sheet.getCell('D6').value = employee['Chức vụ']
  sheet.getCell('D7').value = employee.STT

  fillSection(sheet, employee, 10, SALARY_ROWS)
  fillSection(sheet, employee, 26, ALLOWANCE_ROWS)
  fillSection(sheet, employee, 36, DEDUCTION_ROWS)

  sheet.getCell('E46').value = employee['Họ và tên']

  const buffer = await workbook.xlsx.writeBuffer()
  const fileName =
    `Phiếu lương ${employee['Họ và tên']}_${month}-${year}.xlsx`.replace(
      /[\\/:*?"<>|]/g,
      '-'
    )

  return { buffer, fileName }
}
