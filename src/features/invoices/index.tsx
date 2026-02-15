import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { InvoicesDialogs } from './components/invoices-dialogs'
import { InvoicesLogIn } from './components/invoices-log-in'
import { InvoicesPrimaryButtons } from './components/invoices-primary-buttons'
import { InvoicesProvider } from './components/invoices-provider'
import { InvoicesTable } from './components/invoices-table'

const route = getRouteApi('/_authenticated/invoices/')

const fetchInvoices = async (accessToken: string) => {
  const res = await fetch(
    'https://hoadondientu.gdt.gov.vn:30000/query/invoices/purchase' +
      '?sort=tdlap:desc' +
      '&search=tdlap=ge=08/02/2025T00:00:00;tdlap=le=05/03/2025T23:59:59;ttxly==5',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch invoices')
  }

  return res.json()
}

export function Invoices() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { auth } = useAuthStore()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['invoices', auth.accessTokenInvoice],
    queryFn: () => fetchInvoices(auth.accessTokenInvoice),
    enabled: !!auth.accessTokenInvoice,
    staleTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  if (!auth.accessTokenInvoice) {
    return <InvoicesLogIn />
  }

  if (isLoading) {
    return <div className='p-6'>Loading invoices...</div>
  }

  if (isError) {
    return <div className='p-6 text-red-500'>{error.message}</div>
  }

  return (
    <InvoicesProvider>
      <>
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
              <h2 className='text-2xl font-bold tracking-tight'>
                Invoice List
              </h2>
              <p className='text-muted-foreground'>
                Manage your invoices and their roles here.
              </p>
            </div>
            <InvoicesPrimaryButtons />
          </div>

          <InvoicesTable
            data={data?.datas ?? []}
            search={search}
            navigate={navigate}
          />
        </Main>

        <InvoicesDialogs />
      </>
    </InvoicesProvider>
  )
}
