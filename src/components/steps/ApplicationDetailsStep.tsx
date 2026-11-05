import CheckboxField from '../fields/CheckboxField'
import SelectField from '../fields/SelectField'
import TextField from '../fields/TextField'
import TextareaField from '../fields/TextareaField'

const positionOptions = [
  { label: 'Frontend Developer', value: 'Frontend Developer' },
  { label: 'Backend Developer', value: 'Backend Developer' },
  { label: 'Full Stack Developer', value: 'Full Stack Developer' },
  { label: 'Product Designer', value: 'Product Designer' },
  { label: 'QA Engineer', value: 'QA Engineer' },
]

function ApplicationDetailsStep() {
  return (
    <section aria-labelledby="application-details-title">
      <h2 className="step-title" id="application-details-title">
        Application details
      </h2>
      <p className="step-description">Tell us about the position you are applying for.</p>
      <SelectField
        name="applicationDetails.position"
        label="Position applied for"
        options={positionOptions}
      />
      <TextField
        name="applicationDetails.expectedJoiningDate"
        label="Expected joining date"
        type="date"
      />
      <TextField
        name="applicationDetails.portfolioLink"
        label="Portfolio link (optional)"
        type="url"
        required={false}
        placeholder="https://example.com"
      />
      <TextareaField
        name="applicationDetails.coverNote"
        label="Cover note (optional)"
        maxLength={1000}
        rows={5}
        placeholder="Share anything else you would like us to know."
      />
      <CheckboxField
        name="applicationDetails.acceptedTerms"
        label="I confirm that the information in this application is accurate."
      />
    </section>
  )
}

export default ApplicationDetailsStep
