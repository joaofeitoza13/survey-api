import { Router } from 'express'
import { routeAdapter } from '../adapters/express-routes-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'

export default (router: Router): void => {
  router.post('/surveys', routeAdapter(makeAddSurveyController()))
}
