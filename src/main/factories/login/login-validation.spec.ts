import { makeLoginValidation } from './login-validation'
import { ValidationComposite } from '../../../presentation/helpers/validation/validation-composite'
import { RequiredFieldValidation } from '../../../presentation/helpers/validation/required-field-validation'
import { Validation } from '../../../presentation/protocols/validation'
import { EmailValidation } from '../../../presentation/helpers/validation/email-validation'
import { EmailValidator } from '../../../presentation/protocols/email-validator'

jest.mock('../../../presentation/helpers/validation/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
