import { DbLoadSurveys } from './db-load-surveys'
import { throwError } from '@/domain/test'
import { LoadSurveyRepositorySpy } from '@/data/test'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbLoadSurveys
  loadSurveyRepositorySpy: LoadSurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyRepositorySpy = new LoadSurveyRepositorySpy()
  const sut = new DbLoadSurveys(loadSurveyRepositorySpy)
  return {
    sut,
    loadSurveyRepositorySpy
  }
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveyRepositorySpy } = makeSut()
    await sut.load()
    expect(loadSurveyRepositorySpy.callsCount).toBe(1)
  })

  test('Should return a list of surveys on LoadSurveysRepository success', async () => {
    const { sut, loadSurveyRepositorySpy } = makeSut()
    const httpResponse = await sut.load()
    expect(httpResponse).toEqual(loadSurveyRepositorySpy.surveyModels)
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveyRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyRepositorySpy, 'loadAll').mockImplementationOnce(throwError)
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })
})
