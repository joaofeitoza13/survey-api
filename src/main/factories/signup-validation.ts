import { RequiredFieldValidation } from '../../presentation/helpers/validation/required-field-validation'
import { ValidationComposite } from '../../presentation/helpers/validation/validation-composite'
import { Validation } from '../../presentation/helpers/validation/validation'
import { CompareFieldsValidation } from '../../presentation/helpers/validation/compare-fields-validation'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  return new ValidationComposite(validations)
}
