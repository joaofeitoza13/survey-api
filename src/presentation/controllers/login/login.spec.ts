import { InvalidParamError, MissingParamError } from '../../errors'
import { LoginController } from './login'
import { badRequest, serverError } from '../../helpers/http-helper'
import { EmailValidator, HttpRequest } from '../signup/signup-protocols'
import { Authentication } from '../../../domain/usecases/authentication'

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return new Promise(resolve => resolve('valid_token'))
    }
  }
  return new AuthenticationStub()
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(emailValidatorStub, authenticationStub)
  return {
    sut,
    emailValidatorStub,
    authenticationStub
  }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'valid_email@email.com',
    password: 'valid_password'
  }
})

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = await makeSut()
    const httpRequest = {
      body: {
        password: 'valid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut } = await makeSut()
    const httpRequest = {
      body: {
        email: 'valid_email@email.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = await makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = await makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('valid_email@email.com')
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = await makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = await makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith('valid_email@email.com', 'valid_password')
  })
})
