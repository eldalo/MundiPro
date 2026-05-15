import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InputField } from './input-field'

type Props = Omit<React.ComponentProps<typeof InputField>, 'type' | 'trailing'>

export const PasswordField = forwardRef<HTMLInputElement, Props>(function PasswordField(
  props,
  ref,
) {
  const [shown, setShown] = useState(false)
  return (
    <InputField
      ref={ref}
      type={shown ? 'text' : 'password'}
      trailing={
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground h-9 w-9"
          onClick={() => setShown((v) => !v)}
          aria-label={shown ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      }
      {...props}
    />
  )
})
