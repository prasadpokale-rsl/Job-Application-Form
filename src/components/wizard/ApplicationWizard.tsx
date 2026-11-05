import { useState, type FormEvent } from 'react'
import {
  useFormContext,
  type FieldPath,
  type SubmitHandler,
} from 'react-hook-form'
import type { ApplicationFormValues } from '../../schemas/applicationSchema'
import { submitApplication } from '../../services/mockApplicationApi'
import ApplicationDetailsStep from '../steps/ApplicationDetailsStep'
import EducationStep from '../steps/EducationStep'
import ExperienceStep from '../steps/ExperienceStep'
import PersonalDetailsStep from '../steps/PersonalDetailsStep'
import ReviewStep from '../steps/ReviewStep'

const stepNames = [
  'Personal details',
  'Education',
  'Experience',
  'Application details',
  'Review and submit',
]

const stepFields: FieldPath<ApplicationFormValues>[][] = [
  [
    'personalDetails.fullName',
    'personalDetails.email',
    'personalDetails.phone',
    'personalDetails.dateOfBirth',
    'personalDetails.currentCity',
  ],
  ['education'],
  [
    'experience.candidateType',
    'experience.availabilityToJoin',
    'experience.totalExperience',
    'experience.noticePeriod',
    'experience.previousCompanies',
  ],
  [
    'applicationDetails.position',
    'applicationDetails.expectedJoiningDate',
    'applicationDetails.portfolioLink',
    'applicationDetails.coverNote',
    'applicationDetails.acceptedTerms',
  ],
  [],
]

type Feedback = {
  status: 'error' | 'success'
  message: string
}

function ApplicationWizard() {
  const {
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
    trigger,
  } = useFormContext<ApplicationFormValues>()
  const [currentStep, setCurrentStep] = useState(0)
  const [attempt, setAttempt] = useState(0)
  const [feedback, setFeedback] = useState<Feedback | null>(null)

  function focusFirstInvalidField() {
    document
      .querySelector<HTMLElement>('form [aria-invalid="true"]')
      ?.focus()
  }

  async function goToNextStep() {
    const isCurrentStepValid = await trigger(stepFields[currentStep], {
      shouldFocus: true,
    })

    if (isCurrentStepValid) {
      clearErrors('root.serverError')
      setFeedback(null)
      setCurrentStep((step) => step + 1)
    }
  }

  async function onFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    if (currentStep < stepNames.length - 1) {
      await goToNextStep()
      return
    }

    await handleSubmit(onSubmit, focusFirstInvalidField)()
  }

  function goToPreviousStep() {
    clearErrors('root.serverError')
    setFeedback(null)
    setCurrentStep((step) => Math.max(0, step - 1))
  }

  function editStep(step: number) {
    clearErrors('root.serverError')
    setFeedback(null)
    setCurrentStep(step)
  }

  const onSubmit: SubmitHandler<ApplicationFormValues> = async (application) => {
    clearErrors()
    setFeedback(null)

    const result = await submitApplication(application, attempt)
    setAttempt((previousAttempt) => previousAttempt + 1)

    if (result.status === 'validation-error') {
      result.fieldErrors.forEach(({ name, message }) => {
        setError(name, { type: 'server', message })
      })
      setFeedback({
        status: 'error',
        message: 'The server found an issue. Update the highlighted field and try again.',
      })
      setCurrentStep(0)
      window.setTimeout(focusFirstInvalidField, 0)
      return
    }

    if (result.status === 'server-error') {
      setError('root.serverError', {
        type: 'server',
        message: result.message,
      })
      setFeedback({ status: 'error', message: result.message })
      return
    }

    setFeedback({ status: 'success', message: result.message })
  }

  const steps = [
    <PersonalDetailsStep key="personal-details" />,
    <EducationStep key="education" />,
    <ExperienceStep key="experience" />,
    <ApplicationDetailsStep key="application-details" />,
    <ReviewStep key="review" onEdit={editStep} />,
  ]

  return (
    <main className="app-page">
      <header className="page-heading">
        <h1>Job application</h1>
        <p>Complete each step to apply for a position with our team.</p>
      </header>

      <div className="wizard-card">
        <ol className="step-list" aria-label="Application progress">
          {stepNames.map((name, index) => (
            <li
              key={name}
              aria-current={index === currentStep ? 'step' : undefined}
            >
              {index + 1}. {name}
            </li>
          ))}
        </ol>

        {feedback && (
          <div
            className={`form-message form-message--${feedback.status}`}
            role={feedback.status === 'error' ? 'alert' : 'status'}
          >
            {feedback.message}
          </div>
        )}
        {errors.root?.serverError?.message && !feedback && (
          <div className="form-message form-message--error" role="alert">
            {errors.root.serverError.message}
          </div>
        )}

        <form
          noValidate
          onSubmit={onFormSubmit}
        >
          {steps[currentStep]}

          <div className="wizard-actions">
            {currentStep > 0 ? (
              <button
                className="button-secondary"
                type="button"
                onClick={goToPreviousStep}
              >
                Back
              </button>
            ) : (
              <span />
            )}

            <button
              type="submit"
              disabled={isSubmitting || feedback?.status === 'success'}
            >
              {currentStep < stepNames.length - 1
                ? 'Continue'
                : isSubmitting
                  ? 'Submitting...'
                  : feedback?.status === 'success'
                    ? 'Submitted'
                    : 'Submit application'}
            </button>
          </div>
        </form>

        <p className="required-note">* Required field</p>
      </div>
    </main>
  )
}

export { ApplicationWizard }
