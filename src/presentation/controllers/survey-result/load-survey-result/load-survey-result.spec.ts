import { LoadSurveyResultController } from './load-survey-result'
import { HttpRequest, LoadSurveyById, LoadSurveyResult } from './load-survey-result-protocols'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { mockLoadSurveyResult, mockLoadSurveybyId } from '@/presentation/test'
import { mockSurveyResultModel, throwError } from '@/domain/test'
import MockDate from 'mockdate'

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  }
})

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  loadSurveyResultStub: LoadSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveybyId()
  const loadSurveyResultStub = mockLoadSurveyResult()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultStub)
  return {
    sut,
    loadSurveyByIdStub,
    loadSurveyResultStub
  }
}

describe('LoadSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(makeFakeRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const httpRequest = await sut.handle(makeFakeRequest())
    expect(httpRequest).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(throwError)
    const httpRequest = await sut.handle(makeFakeRequest())
    expect(httpRequest).toEqual(serverError(new Error()))
  })

  test('Should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    jest.spyOn(loadSurveyResultStub, 'load').mockImplementationOnce(throwError)
    const httpRequest = await sut.handle(makeFakeRequest())
    expect(httpRequest).toEqual(serverError(new Error()))
  })

  test('Should return 200 success', async () => {
    const { sut } = makeSut()
    const httpRequest = await sut.handle(makeFakeRequest())
    expect(httpRequest).toEqual(ok(mockSurveyResultModel()))
  })
})
