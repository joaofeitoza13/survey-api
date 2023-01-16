import { AuthMiddleware } from './auth-middleware'
import { HttpRequest } from '../protocols/http'
import { forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors/access-denied-error'

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const sut = new AuthMiddleware()
    const httpRequest: HttpRequest = { headers: {} }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
