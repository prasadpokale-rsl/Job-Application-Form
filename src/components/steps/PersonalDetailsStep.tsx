import TextField from '../fields/TextField'

function PersonalDetailsStep() {
  return (
    <section aria-labelledby="personal-details-title">
      <h2 className="step-title" id="personal-details-title">
        Personal details
      </h2>
      <p className="step-description">Tell us how to contact you.</p>
      <div className="form-grid">
        <TextField
          name="personalDetails.fullName"
          label="Full name"
          autoComplete="name"
          placeholder="Your full name"
        />
        <TextField
          name="personalDetails.email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
        />
        <TextField
          name="personalDetails.phone"
          label="Phone number"
          type="tel"
          autoComplete="tel"
          placeholder="+91 98765 43210"
        />
        <TextField
          name="personalDetails.dateOfBirth"
          label="Date of birth"
          type="date"
          autoComplete="bday"
        />
        <TextField
          name="personalDetails.currentCity"
          label="Current city"
          autoComplete="address-level2"
          placeholder="City"
        />
      </div>
    </section>
  )
}

export default PersonalDetailsStep
