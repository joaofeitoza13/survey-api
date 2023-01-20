import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'
import { SurveyModel } from '@/domain/models/survey'
import { AccountModel } from '@/domain/models/account'
import { SurveyResultModel } from '@/domain/models/survey-result'

let accountCollection: Collection
let surveyCollection: Collection
let surveyResultCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const makeSurvey = async (): Promise<SurveyModel> => {
  const id = await surveyCollection.insertOne({
    question: 'question_1',
    answers: [{
      image: 'image_1',
      answer: 'answer_1'
    }, {
      image: 'image_2',
      answer: 'answer_2'
    }],
    date: new Date()
  }).then(result => result.insertedId)
  const survey = await surveyCollection.findOne<SurveyModel>({ _id: id })
  return MongoHelper.map(survey)
}

const makeAccount = async (): Promise<AccountModel> => {
  const id = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password'
  }).then(result => result.insertedId)
  const account = await accountCollection.findOne<AccountModel>({ _id: id })
  return MongoHelper.map(account)
}

const makeSurveyResult = async (account: AccountModel, survey: SurveyModel): Promise<SurveyResultModel> => {
  const id = await surveyResultCollection.insertOne({
    surveyId: survey.id,
    accountId: account.id,
    answer: survey.answers[0].answer,
    date: new Date()
  }).then(result => result.insertedId)
  const surveyResult = await surveyResultCollection.findOne<SurveyResultModel>({ _id: id })
  return MongoHelper.map(surveyResult)
}

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('account')
    await accountCollection.deleteMany({})
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
  })

  describe('save()', () => {
    test('Should add a survey result if its new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      const sut = makeSut()
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe(survey.answers[0].answer)
    })

    test('Should update a survey result if it already existsd', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      const firstSurvey = await makeSurveyResult(account, survey)
      const sut = makeSut()
      const secondSurvey = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date()
      })
      expect(secondSurvey).toBeTruthy()
      expect(secondSurvey.id).toEqual(firstSurvey.id)
      expect(secondSurvey.answer).toBe(survey.answers[1].answer)
    })
  })
})
