import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { applicationSchema, type ApplicationFormValues } from './schemas/applicationSchema'
import { ApplicationWizard } from './components/wizard/ApplicationWizard'
import './App.css'

function App() {
  const methods = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: false,
    defaultValues: {
      personalDetails: {
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        currentCity: '',
      },
      education: [
        {
          degree: '',
          institution: '',
          passingYear: '',
          percentage: '',
        },
      ],
      experience: {
        candidateType: 'fresher',
        availabilityToJoin: '',
      },
      applicationDetails: {
        position: '',
        expectedJoiningDate: '',
        portfolioLink: '',
        coverNote: '',
        acceptedTerms: false,
      },
    },
  })

  return (
    <FormProvider {...methods}>
      <ApplicationWizard />
    </FormProvider>
  )
}

export default App
