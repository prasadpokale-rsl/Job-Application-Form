import { useFormContext, type FieldPath } from 'react-hook-form'
import type { ApplicationFormValues } from '../../schemas/applicationSchema'
import getFieldMessage from './getFieldMessage'

type SelectFieldProps = {
  name: FieldPath<ApplicationFormValues>
  label: string
  options: { label: string; value: string }[]
  required?: boolean
}

function SelectField({ name, label, options, required = true }: SelectFieldProps) {
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
      <select
        id={inputId}
        aria-required={required}
        aria-invalid={Boolean(message)}
        aria-describedby={message ? errorId : undefined}
        {...register(name)}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {message && (
        <span id={errorId} className="field-error" role="alert">
          {message}
        </span>
      )}
    </div>
  )
}

export default SelectField
