# Job application form

A five-step job application form built with React, TypeScript, React Hook Form, and Zod.

## Run the project

```bash
npm install
npm run dev
```

Run the production build and linter with:

```bash
npm run build
npm run lint
```

## Project structure

- `src/schemas/applicationSchema.ts` contains the Zod schemas and exports the form type inferred from the schema.
- `src/components/fields/` contains reusable input, select, textarea, radio, and checkbox components. They register themselves with the shared form and display their own validation messages.
- `src/components/steps/` contains one component for each step of the application.
- `src/components/wizard/` contains the wizard navigation and step validation.
- `src/services/mockApplicationApi.ts` simulates the server response.

## Form state and validation

The form has one `useForm` instance in `src/App.tsx`. `FormProvider` makes it available to every step and field. Values stay in React Hook Form when a step is hidden, so navigating back does not lose answers.

The form uses `mode: 'onSubmit'` so each step is checked when the user chooses to continue, with `reValidateMode: 'onChange'` to refresh errors while they make corrections. The wizard calls `trigger` for the current step before moving forward.

The Zod schema contains field and cross-field validation, including a minimum age of 18, a previous job end date after its start date, and an expected joining date in the future. Form value types are inferred with `z.infer`.

## Avoiding unnecessary re-renders

- The experience step watches only the candidate type to show the matching set of fields.
- Repeating education and company rows use `useFieldArray` rather than maintaining a second copy of their values.
- The read-only review uses `useWatch` only when that step is displayed; the wizard itself does not subscribe to every field value.

## Mock submission

The mock API waits 1.5 seconds and cycles through a server field validation error, a general server error, and a successful response. This makes all three outcomes easy to try locally.

