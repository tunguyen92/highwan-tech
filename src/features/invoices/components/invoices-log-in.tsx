import { useEffect, useState } from 'react'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  ckey: z.string(),
  cvalue: z.string().min(1, 'Please enter the captcha code'),
  username: z.string(),
  password: z.string(),
})

export function InvoicesLogIn() {
  const [isLoading, setIsLoading] = useState(false)
  const [captcha, setCaptcha] = useState({ key: '', content: '' })
  const { auth } = useAuthStore()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ckey: '',
      cvalue: '',
      username: '',
      password: '',
    },
  })

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('https://hoadondientu.gdt.gov.vn:30000/captcha')
        const data = await res.json()
        setCaptcha(data)
      } catch (err) {
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [form])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)

    const payload = {
      ckey: captcha.key,
      cvalue: data.cvalue,
      username: import.meta.env.VITE_INVOICE_USERNAME,
      password: import.meta.env.VITE_INVOICE_PASSWORD,
    }

    try {
      const res = await fetch(
        'https://hoadondientu.gdt.gov.vn:30000/security-taxpayer/authenticate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )

      if (!res.ok) throw new Error('Login failed')

      const result = await res.json()

      auth.setAccessTokenInvoice(result.token)

      toast.success('Welcome back!')
    } catch (err) {
      console.error(err)
      toast.error('Login error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex h-screen items-center justify-center'>
      <Card className='min-w-2xl gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>Log in</CardTitle>
          <CardDescription>
            Enter captcha code to log into your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-3'>
              <FormField
                control={form.control}
                name='cvalue'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Captcha</FormLabel>
                    <div
                      dangerouslySetInnerHTML={{ __html: captcha.content }}
                    />
                    <FormControl>
                      <Input placeholder='Enter captcha code' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className='mt-2' disabled={isLoading}>
                {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
                Log in
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
