import { RequiredFieldValidation } from '../../../presentation/helpers/validation/required-field-validation'
import { ValidationComposite } from '../../../presentation/helpers/validation/validation-composite'
import { Validation } from '../../../presentation/helpers/validation/validation'
import { EmailValidation } from '../../../presentation/helpers/validation/email-validation'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
