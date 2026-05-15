import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, Lock, Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { InputField } from '@/components/ui-extras/input-field'
import { PasswordField } from '@/components/ui-extras/password-field'
import { SupabaseNotConfigured } from '@/components/feedback/supabase-not-configured'
import { useSignUpMutation } from '@/lib/auth/auth-mutations'
import { isSupabaseConfigured } from '@/lib/supabase'

const schema = z
  .object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    path: ['confirm'],
    message: 'Las contraseñas no coinciden',
  })

type FormValues = z.infer<typeof schema>

export default function Signup() {
  const signUp = useSignUpMutation()
  const navigate = useNavigate()
  const emailRef = useRef<HTMLInputElement>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', confirm: '' },
  })

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const onSubmit = (values: FormValues) => {
    signUp.mutate(
      { email: values.email, password: values.password },
      {
        onSuccess: ({ needsConfirmation }) => {
          if (needsConfirmation) {
            toast.success('Cuenta creada', {
              description: 'Revisa tu email para confirmar la cuenta.',
            })
            navigate('/login', { replace: true })
          } else {
            toast.success('¡Bienvenido a MundiPro!')
            navigate('/', { replace: true })
          }
        },
        onError: (err) => {
          const message = err instanceof Error ? err.message : 'No se pudo crear la cuenta'
          toast.error('Error al registrarse', { description: message })
        },
      },
    )
  }

  const { register, handleSubmit, formState } = form
  const submitting = signUp.isPending
  const emailReg = register('email')

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -top-3 -right-3 h-full w-full rounded-3xl bg-primary"
      />
      <div className="relative panini-card p-7 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <span aria-hidden className="h-1.5 w-8 rounded-full bg-destructive" />
          <span className="panini-eyebrow">Nuevo cromo</span>
        </div>
        <h1 className="panini-display text-4xl">Crea tu álbum</h1>
        <p className="panini-aside text-sm text-[var(--ink-soft)] mt-1 mb-6">
          Únete a la quiniela del Mundial 2026.
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
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            hint="Mínimo 6 caracteres."
            error={formState.errors.password?.message}
            {...register('password')}
          />

          <PasswordField
            id="confirm"
            label="Confirmar contraseña"
            icon={Lock}
            placeholder="Repite tu contraseña"
            autoComplete="new-password"
            error={formState.errors.confirm?.message}
            {...register('confirm')}
          />

          <Button
            type="submit"
            variant="panini"
            size="panini"
            className="w-full"
            disabled={submitting}
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? 'Creando…' : 'Crear cuenta →'}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t-2 border-dashed border-[var(--ink)]/30 text-center text-xs text-[var(--ink-soft)]">
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="font-black uppercase tracking-wider underline decoration-2 underline-offset-4 text-foreground"
          >
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
