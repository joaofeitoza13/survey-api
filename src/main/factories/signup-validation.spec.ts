import { makeSignUpValidation } from './signup-validation'
import { ValidationComposite } from '../../presentation/helpers/validation/validation-composite'
import { RequiredFieldValidation } from '../../presentation/helpers/validation/required-field-validation'
import { Validation } from '../../presentation/helpers/validation/validation'
import { CompareFieldsValidation } from '../../presentation/helpers/validation/compare-fields-validation'

jest.mock('../../presentation/helpers/validation/validation-composite')

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
