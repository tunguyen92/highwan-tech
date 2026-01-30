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
  'Công đoàn': number
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
  'National Holiday Fee (2 Day)': number
  'Monthly Off Fee (1 Day)': number
  'Processing Fee': number
  'Thưởng tết 2026 (Bonus 2026)': number
  'Tổng lương CB+PC': number
  'TỔNG THU NHẬP': number
  'BẢN THÂN VÀ NGƯỜI PHỤ THUỘC (4.400.000/1 NGƯỜI)': number
  'THU NHẬP CHỊU THUẾ': number
  'THU NHẬP TÍNH THUẾ': number
  'THUẾ TNCN': number
  'Tổng BHXH': number
  'Tổng lương thực lãnh': number
  month: string
  year: string
}

export const exportSalarySlip = async (
  employee: any
): Promise<{
  buffer: ArrayBuffer | Uint8Array
  fileName: string
}> => {
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
  const monthNum = parseInt(String(employee.month), 10)
  const yearNum = parseInt(String(employee.year), 10)
  const currMonthStr = String(monthNum).padStart(2, '0')
  const currYearStr = String(yearNum)

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
    `Từ 26/${prevMonthStr}/${prevYearStr} đến 25/${currMonthStr}/${currYearStr}`
  sheet.getCell('D4').value = employee['Họ và tên']
  sheet.getCell('D5').value = employee['Ngày sinh']
  sheet.getCell('D6').value = employee['Chức vụ']
  sheet.getCell('D7').value = employee['STT']

  sheet.getCell('E10').value = employee['Số ngày làm việc trong tháng']
  sheet.getCell('E11').value = employee['Nghỉ lễ, kết hôn, tang chế']
  sheet.getCell('E12').value = employee['Nghỉ phép năm']
  sheet.getCell('E13').value = employee['Nghỉ ốm, Thai sản']
  sheet.getCell('E14').value = employee['Nghỉ không lương']
  sheet.getCell('E15').value = employee['Số ngày làm việc thực tế (ngày)']
  sheet.getCell('E16').value = employee['Tăng ca 150%/ OT 150%']
  sheet.getCell('E17').value = employee['Tăng ca 200%/ OT 200%']
  sheet.getCell('E18').value = employee['Tăng ca 300%/ OT 300%']
  sheet.getCell('E19').value = employee['Tăng ca 210%/ OT 210%']
  sheet.getCell('E20').value = employee['Tăng ca 270%/ OT 270%']
  sheet.getCell('E21').value = employee['Tăng ca 390%/ OT 390%']
  sheet.getCell('E22').value = employee['Lương cơ bản']
  sheet.getCell('E23').value = employee['Hỗ trợ xăng xe, nhà ở']
  sheet.getCell('E24').value =
    Number(employee['Lương cơ bản']) + Number(employee['Hỗ trợ xăng xe, nhà ở'])

  sheet.getCell('E26').value = employee['Tiền điện thoại']
  sheet.getCell('E27').value = employee['Tổng tiền tăng ca']
  sheet.getCell('E28').value = employee['Tổng tiền cơm tăng ca']
  sheet.getCell('E29').value = employee['Tổng tiền cơm trưa']
  sheet.getCell('E30').value = employee['Processing Fee']
  sheet.getCell('E31').value = employee['Thưởng tết 2026 (Bonus 2026)']
  sheet.getCell('E32').value =
    Number(employee['Tiền điện thoại']) +
    Number(employee['Tổng tiền tăng ca']) +
    Number(employee['Tổng tiền cơm tăng ca']) +
    Number(employee['Tổng tiền cơm trưa']) +
    Number(employee['Processing Fee']) +
    Number(employee['Thưởng tết 2026 (Bonus 2026)'])

  sheet.getCell('E34').value = employee['Tổng BHXH']
  sheet.getCell('E35').value = 0
  sheet.getCell('E36').value = employee['THUẾ TNCN']
  sheet.getCell('E37').value =
    Number(employee['Tổng BHXH']) + Number(employee['THUẾ TNCN'])

  sheet.getCell('E38').value = employee['Tổng lương thực lãnh']

  sheet.getCell('E44').value = employee['Họ và tên']

  const excelBuffer = await workbook.xlsx.writeBuffer()
  const fileName = `Phiếu lương ${employee['Họ và tên']}_${employee.month}/${employee.year}.xlsx`
  return { buffer: excelBuffer, fileName }
}
