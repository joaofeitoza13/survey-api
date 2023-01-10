import { Router } from 'express'
import { routeAdapter } from '../adapters/express/express-routes-adapter'
import { makeSignUpController } from '../factories/controllers/signup/signup-controller-factory'
import { makeLoginController } from '../factories/controllers/login/login-controller-factory'

export default (router: Router): void => {
  router.post('/signup', routeAdapter(makeSignUpController()))
  router.post('/login', routeAdapter(makeLoginController()))
}
