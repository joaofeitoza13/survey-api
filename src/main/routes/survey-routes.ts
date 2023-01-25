import { routeAdapter } from '@/main/adapters'
import { makeAddSurveyController, makeLoadSurveysController } from '@/main/factories'
import { adminAuth, auth } from '@/main/middlewares'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, routeAdapter(makeAddSurveyController()))
  router.get('/surveys', auth, routeAdapter(makeLoadSurveysController()))
}
