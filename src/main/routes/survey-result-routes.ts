import { makeSaveSurveyResultController, makeLoadSurveyResultController } from '@/main/factories'
import { routeAdapter } from '@/main/adapters'
import { auth } from '@/main/middlewares'
import { Router } from 'express'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, routeAdapter(makeSaveSurveyResultController()))
  router.get('/surveys/:surveyId/results', auth, routeAdapter(makeLoadSurveyResultController()))
}
