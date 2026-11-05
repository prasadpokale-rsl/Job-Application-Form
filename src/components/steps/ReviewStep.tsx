import { useFormContext, useWatch } from 'react-hook-form'
import type { ApplicationFormValues } from '../../schemas/applicationSchema'

type ReviewStepProps = {
  onEdit: (step: number) => void
}

type ReviewItemProps = {
  label: string
  value: string
}

function ReviewItem({ label, value }: ReviewItemProps) {
  return (
    <div className="review-item">
      <dt>{label}</dt>
      <dd>{value || 'Not provided'}</dd>
    </div>
  )
}

function ReviewStep({ onEdit }: ReviewStepProps) {
  const { control } = useFormContext<ApplicationFormValues>()
  const values = useWatch({ control })
  const personalDetails = values.personalDetails
  const experience = values.experience
  const applicationDetails = values.applicationDetails

  return (
    <section aria-labelledby="review-title">
      <h2 className="step-title" id="review-title">
        Review and submit
      </h2>
      <p className="step-description">
        Check your details before sending your application.
      </p>

      <section className="review-section" aria-labelledby="review-personal-title">
        <div className="review-section-heading">
          <h3 id="review-personal-title">Personal details</h3>
          <button className="button-secondary" type="button" onClick={() => onEdit(0)}>
            Edit
          </button>
        </div>
        <dl className="review-grid">
          <ReviewItem label="Full name" value={personalDetails?.fullName ?? ''} />
          <ReviewItem label="Email address" value={personalDetails?.email ?? ''} />
          <ReviewItem label="Phone number" value={personalDetails?.phone ?? ''} />
          <ReviewItem
            label="Date of birth"
            value={personalDetails?.dateOfBirth ?? ''}
          />
          <ReviewItem label="Current city" value={personalDetails?.currentCity ?? ''} />
        </dl>
      </section>

      <section className="review-section" aria-labelledby="review-education-title">
        <div className="review-section-heading">
          <h3 id="review-education-title">Education</h3>
          <button className="button-secondary" type="button" onClick={() => onEdit(1)}>
            Edit
          </button>
        </div>
        {values.education?.map((education, index) => (
          <div className="array-card" key={`${education.degree}-${index}`}>
            <h4>Qualification {index + 1}</h4>
            <dl className="review-grid">
              <ReviewItem label="Degree" value={education.degree ?? ''} />
              <ReviewItem label="Institution" value={education.institution ?? ''} />
              <ReviewItem label="Passing year" value={education.passingYear ?? ''} />
              <ReviewItem label="Percentage" value={education.percentage ?? ''} />
            </dl>
          </div>
        ))}
      </section>

      <section className="review-section" aria-labelledby="review-experience-title">
        <div className="review-section-heading">
          <h3 id="review-experience-title">Experience</h3>
          <button className="button-secondary" type="button" onClick={() => onEdit(2)}>
            Edit
          </button>
        </div>
        {experience?.candidateType === 'fresher' ? (
          <dl className="review-grid">
            <ReviewItem label="Experience level" value="Fresher" />
            <ReviewItem
              label="Availability to join"
              value={experience.availabilityToJoin ?? ''}
            />
          </dl>
        ) : experience?.candidateType === 'experienced' ? (
          <>
            <dl className="review-grid">
              <ReviewItem label="Experience level" value="Experienced" />
              <ReviewItem
                label="Total experience"
                value={`${experience.totalExperience ?? ''} years`}
              />
              <ReviewItem label="Notice period" value={experience.noticePeriod ?? ''} />
            </dl>
            <ul className="review-list">
              {experience.previousCompanies?.map((company, index) => (
                <li key={`${company.companyName}-${index}`}>
                  {company.companyName} - {company.role} ({company.fromDate} to{' '}
                  {company.toDate})
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </section>

      <section className="review-section" aria-labelledby="review-application-title">
        <div className="review-section-heading">
          <h3 id="review-application-title">Application details</h3>
          <button className="button-secondary" type="button" onClick={() => onEdit(3)}>
            Edit
          </button>
        </div>
        <dl className="review-grid">
          <ReviewItem
            label="Position"
            value={applicationDetails?.position ?? ''}
          />
          <ReviewItem
            label="Expected joining date"
            value={applicationDetails?.expectedJoiningDate ?? ''}
          />
          <ReviewItem
            label="Portfolio link"
            value={applicationDetails?.portfolioLink ?? ''}
          />
          <ReviewItem
            label="Cover note"
            value={applicationDetails?.coverNote ?? ''}
          />
          <ReviewItem
            label="Terms accepted"
            value={applicationDetails?.acceptedTerms ? 'Yes' : 'No'}
          />
        </dl>
      </section>
    </section>
  )
}

export default ReviewStep
