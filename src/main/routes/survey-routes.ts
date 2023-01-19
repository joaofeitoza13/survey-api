import { auth } from '@/main/middlewares/auth'
import { adminAuth } from '@/main/middlewares/adminAuth'
import { routeAdapter } from '@/main/adapters/express-routes-adapter'
import { makeAddSurveyController } from '@/main/factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeLoadSurveysController } from '@/main/factories/controllers/survey/load-surveys/load-surveys-controller-factory'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, routeAdapter(makeAddSurveyController()))
  router.get('/surveys', auth, routeAdapter(makeLoadSurveysController()))
}
