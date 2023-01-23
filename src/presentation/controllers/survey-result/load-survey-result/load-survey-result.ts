import { Controller, HttpRequest, HttpResponse, LoadSurveyResult } from './load-survey-result-protocols'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyByIdStub: LoadSurveyById,
    private readonly loadSurveyResultStub: LoadSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const survey = await this.loadSurveyByIdStub.loadById(surveyId)
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      await this.loadSurveyResultStub.load(surveyId)
      return Promise.resolve(null)
    } catch (error) {
      return serverError(error)
    }
  }
}
