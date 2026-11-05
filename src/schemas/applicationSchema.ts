import { z } from 'zod'

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

function getLocalDateString(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const personalDetailsSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Enter your full name.').max(100),
    email: z.string().trim().email('Enter a valid email address.'),
    phone: z
      .string()
      .trim()
      .refine((value) => {
        if (!/^\+?[\d\s()-]+$/.test(value) || (value.includes('+') && !value.startsWith('+91'))) {
          return false
        }

        const digits = value.replace(/\D/g, '')
        const mobileNumber = digits.length === 12 && digits.startsWith('91')
          ? digits.slice(2)
          : digits.length === 11 && digits.startsWith('0')
            ? digits.slice(1)
            : digits

        return /^[6-9]\d{9}$/.test(mobileNumber)
      }, 'Enter a valid Indian mobile number.'),
    dateOfBirth: z.string().min(1, 'Enter your date of birth.'),
    currentCity: z.string().trim().min(2, 'Enter your current city.').max(80),
  })
  .superRefine(({ dateOfBirth }, context) => {
    if (!isValidDate(dateOfBirth)) {
      context.addIssue({
        code: 'custom',
        path: ['dateOfBirth'],
        message: 'Enter a valid date of birth.',
      })
      return
    }

    const eighteenthBirthday = new Date()
    eighteenthBirthday.setFullYear(eighteenthBirthday.getFullYear() - 18)

    if (dateOfBirth > getLocalDateString(eighteenthBirthday)) {
      context.addIssue({
        code: 'custom',
        path: ['dateOfBirth'],
        message: 'You must be at least 18 years old.',
      })
    }
  })

const educationEntrySchema = z.object({
  degree: z.string().trim().min(1, 'Enter your degree or qualification.').max(100),
  institution: z.string().trim().min(1, 'Enter your institution.').max(120),
  passingYear: z
    .string()
    .regex(/^\d{4}$/, 'Enter a four-digit year.')
    .refine((year) => Number(year) >= 1900, {
      message: 'Enter a year from 1900 onward.',
    })
    .refine((year) => Number(year) <= new Date().getFullYear(), {
      message: 'Passing year cannot be in the future.',
    }),
  percentage: z
    .string()
    .trim()
    .refine((value) => value !== '' && !Number.isNaN(Number(value)), {
      message: 'Enter your percentage.',
    })
    .refine((value) => Number(value) >= 1 && Number(value) <= 100, {
      message: 'Enter a value between 1 and 100.',
    }),
})

const fresherExperienceSchema = z.object({
  candidateType: z.literal('fresher'),
  availabilityToJoin: z.string().min(1, 'Select when you are available to join.'),
})

const previousCompanySchema = z
  .object({
    companyName: z.string().trim().min(1, 'Enter the company name.').max(120),
    role: z.string().trim().min(1, 'Enter your role.').max(100),
    fromDate: z.string().min(1, 'Enter the start date.'),
    toDate: z.string().min(1, 'Enter the end date.'),
  })
  .superRefine(({ fromDate, toDate }, context) => {
    if (isValidDate(fromDate) && isValidDate(toDate) && toDate <= fromDate) {
      context.addIssue({
        code: 'custom',
        path: ['toDate'],
        message: 'End date must be after the start date.',
      })
    }
  })

const experiencedSchema = z.object({
  candidateType: z.literal('experienced'),
  totalExperience: z
    .string()
    .trim()
    .refine((value) => value !== '' && !Number.isNaN(Number(value)), {
      message: 'Enter your total experience in years.',
    })
    .refine((value) => Number(value) > 0 && Number(value) <= 50, {
      message: 'Experience must be more than 0 and no more than 50 years.',
    }),
  noticePeriod: z.string().min(1, 'Select your notice period.'),
  previousCompanies: z
    .array(previousCompanySchema)
    .min(1, 'Add at least one previous company.'),
})

const applicationDetailsSchema = z
  .object({
    position: z.string().min(1, 'Select a position.'),
    expectedJoiningDate: z.string().min(1, 'Enter your expected joining date.'),
    portfolioLink: z
      .string()
      .trim()
      .refine(
        (value) => value === '' || z.url().safeParse(value).success,
        'Enter a valid URL or leave this field empty.',
      ),
    coverNote: z.string().max(1000, 'Cover note must be 1,000 characters or fewer.'),
    acceptedTerms: z.boolean().refine((accepted) => accepted, {
      message: 'You must accept the terms before submitting.',
    }),
  })
  .superRefine(({ expectedJoiningDate }, context) => {
    if (!isValidDate(expectedJoiningDate)) {
      context.addIssue({
        code: 'custom',
        path: ['expectedJoiningDate'],
        message: 'Enter a valid joining date.',
      })
      return
    }

    if (expectedJoiningDate <= getLocalDateString(new Date())) {
      context.addIssue({
        code: 'custom',
        path: ['expectedJoiningDate'],
        message: 'Expected joining date must be in the future.',
      })
    }
  })

export const applicationSchema = z.object({
  personalDetails: personalDetailsSchema,
  education: z.array(educationEntrySchema).min(1, 'Add at least one qualification.'),
  experience: z.discriminatedUnion('candidateType', [
    fresherExperienceSchema,
    experiencedSchema,
  ]),
  applicationDetails: applicationDetailsSchema,
})

export type ApplicationFormValues = z.infer<typeof applicationSchema>
