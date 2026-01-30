import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { PayslipsDialogs } from './components/payslips-dialogs'
import { PayslipsPrimaryButtons } from './components/payslips-primary-buttons'
import { PayslipsProvider } from './components/payslips-provider'
import { PayslipsTable } from './components/payslips-table'
import { payslips } from './data/payslips'

export function Payslips() {
  return (
    <PayslipsProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Payslips</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your payslips for this month!
            </p>
          </div>
          <PayslipsPrimaryButtons />
        </div>
        {/* <PayslipsTable data={payslips} /> */}
      </Main>

      <PayslipsDialogs />
    </PayslipsProvider>
  )
}
