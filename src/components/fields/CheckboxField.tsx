import { useFormContext, type FieldPath } from 'react-hook-form'
import type { ApplicationFormValues } from '../../schemas/applicationSchema'
import getFieldMessage from './getFieldMessage'

type CheckboxFieldProps = {
  name: FieldPath<ApplicationFormValues>
  label: string
}

function CheckboxField({ name, label }: CheckboxFieldProps) {
  const {
    formState: { errors },
    register,
  } = useFormContext<ApplicationFormValues>()
  const message = getFieldMessage(errors, name)
  const inputId = name.replaceAll('.', '-')
  const errorId = `${inputId}-error`

  return (
    <div className="field">
      <div className="choice-option">
        <input
          id={inputId}
          type="checkbox"
          aria-required="true"
          aria-invalid={Boolean(message)}
          aria-describedby={message ? errorId : undefined}
          {...register(name)}
        />
        <label htmlFor={inputId}>
          {label}
          <span className="required-mark" aria-hidden="true">
            {' '}
            *
          </span>
        </label>
      </div>
      {message && (
        <span id={errorId} className="field-error" role="alert">
          {message}
        </span>
      )}
    </div>
  )
}

export default CheckboxField
