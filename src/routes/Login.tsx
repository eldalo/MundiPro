import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, Lock, Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { InputField } from '@/components/ui-extras/input-field'
import { PasswordField } from '@/components/ui-extras/password-field'
import { SupabaseNotConfigured } from '@/components/feedback/supabase-not-configured'
import { useSignInMutation } from '@/lib/auth/auth-mutations'
import { isSupabaseConfigured } from '@/lib/supabase'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type FormValues = z.infer<typeof schema>

export default function Login() {
  const signIn = useSignInMutation()
  const navigate = useNavigate()
  const location = useLocation()
  const emailRef = useRef<HTMLInputElement>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const onSubmit = (values: FormValues) => {
    signIn.mutate(values, {
      onSuccess: () => {
        const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname
        navigate(from ?? '/', { replace: true })
      },
      onError: (err) => {
        const message = err instanceof Error ? err.message : 'No se pudo iniciar sesión'
        toast.error('Error al iniciar sesión', { description: message })
      },
    })
  }

  const { register, handleSubmit, formState } = form
  const submitting = signIn.isPending
  const emailReg = register('email')

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -top-3 -right-3 h-full w-full rounded-3xl bg-destructive"
      />
      <div className="relative panini-card p-7 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <span aria-hidden className="h-1.5 w-8 rounded-full bg-primary" />
          <span className="panini-eyebrow">Cromo 001</span>
        </div>
        <h1 className="panini-display text-4xl">Entra al álbum</h1>
        <p className="panini-aside text-sm text-[var(--ink-soft)] mt-1 mb-6">
          Bienvenido de vuelta a tu quiniela del Mundial 2026.
        </p>

        {!isSupabaseConfigured && (
          <div className="mb-4">
            <SupabaseNotConfigured />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <InputField
            id="email"
            label="Email"
            icon={Mail}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="tu@email.com"
            error={formState.errors.email?.message}
            {...emailReg}
            ref={(el) => {
              emailReg.ref(el)
              emailRef.current = el
            }}
          />

          <PasswordField
            id="password"
            label="Contraseña"
            icon={Lock}
            placeholder="••••••••"
            autoComplete="current-password"
            error={formState.errors.password?.message}
            {...register('password')}
          />

          <Button
            type="submit"
            variant="panini"
            size="panini"
            className="w-full"
            disabled={submitting}
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? 'Pegando cromo…' : 'Pegar cromo →'}
          </Button>
        </form>
      </div>
    </div>
  )
}
