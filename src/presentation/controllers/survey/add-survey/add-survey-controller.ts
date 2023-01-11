import { badRequest, noContent, serverError } from '../../../helpers/http/http-helper'
import { AddSurvey, Controller, HttpRequest, HttpResponse, Validation } from './add-survey-controller-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validationStub: Validation,
    private readonly addSurveyStub: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validationStub.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { question, answers } = httpRequest.body
      await this.addSurveyStub.add({
        question,
        answers
      })
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
