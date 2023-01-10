import { Controller, HttpRequest, HttpResponse, Validation } from './add-survey-controller-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validationStub: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.validationStub.validate(httpRequest.body)
    return new Promise(resolve => resolve(null))
  }
}
