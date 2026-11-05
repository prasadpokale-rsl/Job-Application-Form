import type { TextareaHTMLAttributes } from 'react'
import { useFormContext, type FieldPath } from 'react-hook-form'
import type { ApplicationFormValues } from '../../schemas/applicationSchema'
import getFieldMessage from './getFieldMessage'

type TextareaFieldProps = {
  name: FieldPath<ApplicationFormValues>
  label: string
  required?: boolean
} & Pick<TextareaHTMLAttributes<HTMLTextAreaElement>, 'maxLength' | 'placeholder' | 'rows'>

function TextareaField({
  name,
  label,
  required = false,
  ...textareaProps
}: TextareaFieldProps) {
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
      <textarea
        id={inputId}
        aria-required={required}
        aria-invalid={Boolean(message)}
        aria-describedby={message ? errorId : undefined}
        {...register(name)}
        {...textareaProps}
      />
      {message && (
        <span id={errorId} className="field-error" role="alert">
          {message}
        </span>
      )}
    </div>
  )
}

export default TextareaField
