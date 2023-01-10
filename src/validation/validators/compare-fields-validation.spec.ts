import { InvalidParamError } from '../../presentation/errors'
import { CompareFieldsValidation } from '../../validation/validators/compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('RequiredFields validation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'wrong_value'
    })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'valid_value',
      fieldToCompare: 'valid_value'
    })
    expect(error).toBeFalsy()
  })
})
