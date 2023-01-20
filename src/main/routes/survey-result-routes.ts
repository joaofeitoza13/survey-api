import { makeSaveSurveyResultController } from '@/main/factories/controllers/survey-result/save-survey-result/save-surveys-result-controller-factory'
import { routeAdapter } from '@/main/adapters/express-routes-adapter'
import { auth } from '@/main/middlewares/auth'
import { Router } from 'express'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, routeAdapter(makeSaveSurveyResultController()))
}
