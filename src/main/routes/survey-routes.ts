import { Router } from 'express'
import { routeAdapter } from '../adapters/express/express-routes-adapter'
import { makeAddSurveyController } from '../factories/controllers/add-survey/add-survey-controller-factory'

export default (router: Router): void => {
  router.post('/surveys', routeAdapter(makeAddSurveyController()))
}
