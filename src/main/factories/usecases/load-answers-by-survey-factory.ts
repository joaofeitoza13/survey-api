import { SurveyMongoRepository } from '@/infra/db'
import { LoadAnswersBySurvey } from '@/domain/usecases'
import { DbLoadAnswerBySurvey } from '@/data/usecases'

export const makeDbLoadAnswersBySurvey = (): LoadAnswersBySurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadAnswerBySurvey(surveyMongoRepository)
}
