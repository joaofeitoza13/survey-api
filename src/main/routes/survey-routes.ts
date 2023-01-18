import { Router } from 'express'
import { auth } from '../middlewares/auth'
import { adminAuth } from '../middlewares/adminAuth'
import { routeAdapter } from '../adapters/express-routes-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeLoadSurveysController } from '../factories/controllers/survey/load-surveys/load-surveys-controller-factory'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, routeAdapter(makeAddSurveyController()))
  router.get('/surveys', auth, routeAdapter(makeLoadSurveysController()))
}
