import { get, type FieldErrors, type FieldPath } from 'react-hook-form'
import type { ApplicationFormValues } from '../../schemas/applicationSchema'

function getFieldMessage(
  errors: FieldErrors<ApplicationFormValues>,
  name: FieldPath<ApplicationFormValues>,
) {
  const error = get(errors, name)

  if (typeof error !== 'object' || error === null || !('message' in error)) {
    return undefined
  }

  return typeof error.message === 'string' ? error.message : undefined
}

export default getFieldMessage
