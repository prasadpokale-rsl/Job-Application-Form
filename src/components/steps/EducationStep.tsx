import { useFieldArray, useFormContext } from 'react-hook-form'
import type { ApplicationFormValues } from '../../schemas/applicationSchema'
import TextField from '../fields/TextField'

const currentYear = String(new Date().getFullYear())

function EducationStep() {
  const { control } = useFormContext<ApplicationFormValues>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  })

  return (
    <section aria-labelledby="education-title">
      <h2 className="step-title" id="education-title">
        Education
      </h2>
      <p className="step-description">
        Add at least one qualification. You can add more than one.
      </p>
      {fields.map((field, index) => (
        <div className="array-card" key={field.id}>
          <h3>Qualification {index + 1}</h3>
          <div className="form-grid">
            <TextField
              name={`education.${index}.degree`}
              label="Degree or qualification"
              placeholder="Bachelor of Science"
            />
            <TextField
              name={`education.${index}.institution`}
              label="Institution"
              placeholder="University or school"
            />
            <TextField
              name={`education.${index}.passingYear`}
              label="Year of passing"
              type="number"
              min="1900"
              max={currentYear}
              placeholder="2024"
            />
            <TextField
              name={`education.${index}.percentage`}
              label="Percentage or score"
              type="number"
              min="1"
              max="100"
              step="0.01"
              placeholder="85"
            />
          </div>
          {fields.length > 1 && (
            <button
              className="button-secondary"
              type="button"
              onClick={() => remove(index)}
            >
              Remove qualification
            </button>
          )}
        </div>
      ))}
      <button
        className="button-secondary"
        type="button"
        onClick={() =>
          append({
            degree: '',
            institution: '',
            passingYear: '',
            percentage: '',
          })
        }
      >
        Add another qualification
      </button>
    </section>
  )
}

export default EducationStep
