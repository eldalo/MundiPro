import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Image as ImageIcon, Loader2, User } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { InputField } from '@/components/ui-extras/input-field'
import { useUpdateMyProfile } from '@/lib/queries/profile'
import type { Profile } from '@/lib/db/types'

const schema = z.object({
  display_name: z
    .string()
    .trim()
    .min(2, 'Mínimo 2 caracteres')
    .max(30, 'Máximo 30 caracteres'),
  avatar_url: z
    .string()
    .trim()
    .refine(
      (v) => v === '' || /^https?:\/\/\S+$/i.test(v),
      'URL inválida (http/https)',
    ),
})

type FormValues = z.infer<typeof schema>

export function ProfileEditCard({ profile }: { profile: Profile }) {
  const update = useUpdateMyProfile()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      display_name: profile.display_name ?? '',
      avatar_url: profile.avatar_url ?? '',
    },
  })

  const { control, register, handleSubmit, formState } = form
  const previewName = useWatch({ control, name: 'display_name' })
  const previewUrl = useWatch({ control, name: 'avatar_url' })
  const previewInitials = (previewName || profile.display_name || '??')
    .trim()
    .slice(0, 2)
    .toUpperCase()

  const onSubmit = (values: FormValues) => {
    update.mutate(
      {
        display_name: values.display_name,
        avatar_url: values.avatar_url === '' ? null : values.avatar_url,
      },
      {
        onSuccess: () => toast.success('Cromo actualizado'),
        onError: (err) => {
          const message = err instanceof Error ? err.message : 'No se pudo guardar'
          toast.error('Error', { description: message })
        },
      },
    )
  }

  return (
    <div className="panini-card p-6">
      <div className="flex items-center gap-2 mb-1">
        <span aria-hidden className="h-1 w-6 rounded-full bg-destructive" />
        <span className="panini-eyebrow">Editar cromo</span>
      </div>
      <h3 className="panini-display text-2xl">Datos personales</h3>
      <p className="panini-aside text-sm text-[var(--ink-soft)] mt-1 mb-5">
        Cómo apareces en el ranking y en los cromos compartidos.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="flex items-center gap-4 rounded-xl border-2 border-dashed border-[var(--ink)]/30 p-3">
          <Avatar className="h-14 w-14 border-2 border-[var(--ink)]">
            <AvatarImage src={previewUrl || undefined} alt="" />
            <AvatarFallback className="text-sm font-black bg-accent text-foreground">
              {previewInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5">
            <p className="panini-eyebrow">Vista previa</p>
            <p className="panini-aside text-xs text-[var(--ink-soft)]">Se actualiza al escribir.</p>
          </div>
        </div>

        <InputField
          id="display_name"
          label="Nombre visible"
          icon={User}
          autoComplete="nickname"
          placeholder="Tu nombre"
          error={formState.errors.display_name?.message}
          {...register('display_name')}
        />

        <InputField
          id="avatar_url"
          label="URL del avatar (opcional)"
          icon={ImageIcon}
          type="url"
          inputMode="url"
          placeholder="https://..."
          autoComplete="off"
          hint="Pega un enlace público a una imagen."
          error={formState.errors.avatar_url?.message}
          {...register('avatar_url')}
        />

        <div className="flex justify-end pt-2 border-t-2 border-dashed border-[var(--ink)]/30">
          <Button
            type="submit"
            variant="panini"
            size="panini-sm"
            disabled={update.isPending || !formState.isDirty}
          >
            {update.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  )
}
