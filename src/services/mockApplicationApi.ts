import type { FieldPath } from 'react-hook-form'
import type { ApplicationFormValues } from '../schemas/applicationSchema'

export type SubmissionResult =
  | {
      status: 'validation-error'
      fieldErrors: { name: FieldPath<ApplicationFormValues>; message: string }[]
    }
  | { status: 'server-error'; message: string }
  | { status: 'success'; message: string }

export async function submitApplication(
  _application: ApplicationFormValues,
  attempt: number,
): Promise<SubmissionResult> {
  await new Promise((resolve) => window.setTimeout(resolve, 1500))

  switch (attempt % 3) {
    case 0:
      return {
        status: 'validation-error',
        fieldErrors: [
          {
            name: 'personalDetails.email',
            message: 'This email address is already associated with an application.',
          },
        ],
      }
    case 1:
      return {
        status: 'server-error',
        message: 'The application could not be submitted. Please try again.',
      }
    default:
      return {
        status: 'success',
        message: 'Your application has been submitted successfully.',
      }
  }
}
