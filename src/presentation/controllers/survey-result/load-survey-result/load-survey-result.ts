import { Controller, HttpRequest, HttpResponse } from './load-survey-result-protocols'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'

export class LoadSurveyResultController implements Controller {
  constructor (private readonly loadSurveyByIdStub: LoadSurveyById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveyByIdStub.loadById(httpRequest.params.surveyId)
    return null
  }
}
