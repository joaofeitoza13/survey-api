import { Router } from 'express'
import { makeSignUpController } from '../factories/signup/signup-factory'
import { routeAdapter } from '../adapters/express-routes-adapter'

export default (router: Router): void => {
  router.post('/signup', routeAdapter(makeSignUpController()))
}
