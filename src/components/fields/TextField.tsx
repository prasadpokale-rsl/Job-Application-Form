import type { InputHTMLAttributes } from 'react'
import { useFormContext, type FieldPath } from 'react-hook-form'
import type { ApplicationFormValues } from '../../schemas/applicationSchema'
import getFieldMessage from './getFieldMessage'

type TextFieldProps = {
  name: FieldPath<ApplicationFormValues>
  label: string
  required?: boolean
} & Pick<
  InputHTMLAttributes<HTMLInputElement>,
  'autoComplete' | 'max' | 'min' | 'placeholder' | 'step' | 'type'
>

function TextField({
  name,
  label,
  type = 'text',
  required = true,
  ...inputProps
}: TextFieldProps) {
  const {
    formState: { errors },
    register,
  } = useFormContext<ApplicationFormValues>()
  const message = getFieldMessage(errors, name)
  const inputId = name.replaceAll('.', '-')
  const errorId = `${inputId}-error`

  return (
    <div className="field">
      <label htmlFor={inputId}>
        {label}
        {required && (
          <span className="required-mark" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      <input
        id={inputId}
        type={type}
        aria-required={required}
        aria-invalid={Boolean(message)}
        aria-describedby={message ? errorId : undefined}
        {...register(name)}
        {...inputProps}
      />
      {message && (
        <span id={errorId} className="field-error" role="alert">
          {message}
        </span>
      )}
    </div>
  )
}

export default TextField
