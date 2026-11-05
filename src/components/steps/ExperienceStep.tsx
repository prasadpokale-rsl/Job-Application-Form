import { useEffect, useRef } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import type { ApplicationFormValues } from '../../schemas/applicationSchema'
import RadioGroupField from '../fields/RadioGroupField'
import SelectField from '../fields/SelectField'
import TextField from '../fields/TextField'

const availabilityOptions = [
  { label: 'Immediately', value: 'Immediately' },
  { label: 'Within 15 days', value: 'Within 15 days' },
  { label: 'Within 30 days', value: 'Within 30 days' },
  { label: 'Within 60 days', value: 'Within 60 days' },
]

const noticePeriodOptions = [
  { label: 'Immediate', value: 'Immediate' },
  { label: '15 days', value: '15 days' },
  { label: '30 days', value: '30 days' },
  { label: '60 days', value: '60 days' },
  { label: '90 days', value: '90 days' },
]

function FresherFields() {
  return (
    <div>
      <SelectField
        name="experience.availabilityToJoin"
        label="When are you available to join?"
        options={availabilityOptions}
      />
    </div>
  )
}

function PreviousCompanyFields() {
  const { control } = useFormContext<ApplicationFormValues>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience.previousCompanies',
  })
  const hasAddedInitialCompany = useRef(false)

  useEffect(() => {
    if (fields.length === 0 && !hasAddedInitialCompany.current) {
      hasAddedInitialCompany.current = true
      append({
        companyName: '',
        role: '',
        fromDate: '',
        toDate: '',
      })
    }
  }, [append, fields.length])

  return (
    <div>
      {fields.map((field, index) => (
        <div className="array-card" key={field.id}>
          <h3>Previous company {index + 1}</h3>
          <div className="form-grid">
            <TextField
              name={`experience.previousCompanies.${index}.companyName`}
              label="Company name"
              placeholder="Company"
            />
            <TextField
              name={`experience.previousCompanies.${index}.role`}
              label="Your role"
              placeholder="Job title"
            />
            <TextField
              name={`experience.previousCompanies.${index}.fromDate`}
              label="Start date"
              type="date"
            />
            <TextField
              name={`experience.previousCompanies.${index}.toDate`}
              label="End date"
              type="date"
            />
          </div>
          {fields.length > 1 && (
            <button
              className="button-secondary"
              type="button"
              onClick={() => remove(index)}
            >
              Remove company
            </button>
          )}
        </div>
      ))}
      <button
        className="button-secondary"
        type="button"
        onClick={() =>
          append({
            companyName: '',
            role: '',
            fromDate: '',
            toDate: '',
          })
        }
      >
        Add another company
      </button>
    </div>
  )
}

function ExperiencedFields() {
  return (
    <div>
      <div className="form-grid">
        <TextField
          name="experience.totalExperience"
          label="Total experience (years)"
          type="number"
          min="0.1"
          max="50"
          step="0.1"
          placeholder="3"
        />
        <SelectField
          name="experience.noticePeriod"
          label="Notice period"
          options={noticePeriodOptions}
        />
      </div>
      <h3>Previous companies</h3>
      <PreviousCompanyFields />
    </div>
  )
}

function ExperienceFields() {
  const { control } = useFormContext<ApplicationFormValues>()
  const candidateType = useWatch({
    control,
    name: 'experience.candidateType',
  })

  return candidateType === 'experienced' ? <ExperiencedFields /> : <FresherFields />
}

function ExperienceStep() {
  return (
    <section aria-labelledby="experience-title">
      <h2 className="step-title" id="experience-title">
        Experience
      </h2>
      <p className="step-description">
        Choose the option that best describes your work experience.
      </p>
      <RadioGroupField
        name="experience.candidateType"
        label="Experience level"
        options={[
          { label: 'Fresher', value: 'fresher' },
          { label: 'Experienced', value: 'experienced' },
        ]}
      />
      <ExperienceFields />
    </section>
  )
}

export default ExperienceStep
