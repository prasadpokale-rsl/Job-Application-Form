import { useFormContext, type FieldPath } from 'react-hook-form'
import type { ApplicationFormValues } from '../../schemas/applicationSchema'
import getFieldMessage from './getFieldMessage'

type RadioGroupFieldProps = {
  name: FieldPath<ApplicationFormValues>
  label: string
  options: { label: string; value: string }[]
  required?: boolean
}

function RadioGroupField({
  name,
  label,
  options,
  required = true,
}: RadioGroupFieldProps) {
  const {
    formState: { errors },
    register,
  } = useFormContext<ApplicationFormValues>()
  const message = getFieldMessage(errors, name)
  const groupId = name.replaceAll('.', '-')
  const errorId = `${groupId}-error`

  return (
    <fieldset className="field choice-group" aria-required={required}>
      <legend>
        {label}
        {required && (
          <span className="required-mark" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </legend>
      <div className="choice-list">
        {options.map((option, index) => {
          const optionId = `${groupId}-${index}`

          return (
            <div className="choice-option" key={option.value}>
              <input
                id={optionId}
                type="radio"
                value={option.value}
                aria-required={required}
                aria-invalid={Boolean(message)}
                aria-describedby={message ? errorId : undefined}
                {...register(name)}
              />
              <label htmlFor={optionId}>{option.label}</label>
            </div>
          )
        })}
      </div>
      {message && (
        <span id={errorId} className="field-error" role="alert">
          {message}
        </span>
      )}
    </fieldset>
  )
}

export default RadioGroupField
