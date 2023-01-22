import { mockLoadSurveybyId } from '@/presentation/test'
import { LoadSurveyResultController } from './load-survey-result'
import { HttpRequest } from './load-survey-result-protocols'

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  }
})

describe('LoadSurveyResult Controller', () => {
  test('Should call LoadSurveyById with correct values', async () => {
    const loadSurveyByIdStub = mockLoadSurveybyId()
    const sut = new LoadSurveyResultController(loadSurveyByIdStub)
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(makeFakeRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })
})
