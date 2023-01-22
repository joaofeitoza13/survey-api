import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { SurveyModel } from '@/domain/models/survey'
import { AccountModel } from '@/domain/models/account'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { Collection, ObjectId } from 'mongodb'

let accountCollection: Collection
let surveyCollection: Collection
let surveyResultCollection: Collection

const makeSut = (): SurveyResultMongoRepository => (new SurveyResultMongoRepository())

const makeSurvey = async (): Promise<SurveyModel> => {
  const id = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }, {
      image: 'other_image',
      answer: 'other_answer'
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
    surveyId: new ObjectId(survey.id),
    accountId: new ObjectId(account.id),
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
      expect(surveyResult.surveyId).toEqual(survey.id)
      expect(surveyResult.answers[0].answer).toBe(survey.answers[0].answer)
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(100)
      expect(surveyResult.answers[1].count).toBe(0)
      expect(surveyResult.answers[1].percent).toBe(0)
    })

    test('Should update a survey result if it already exists', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      await makeSurveyResult(account, survey)
      const sut = makeSut()
      const updatedSurveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date()
      })
      expect(updatedSurveyResult).toBeTruthy()
      expect(updatedSurveyResult.surveyId).toEqual(survey.id)
      expect(updatedSurveyResult.answers[0].answer).toBe(survey.answers[1].answer)
      expect(updatedSurveyResult.answers[0].count).toBe(1)
      expect(updatedSurveyResult.answers[0].percent).toBe(100)
      expect(updatedSurveyResult.answers[1].count).toBe(0)
      expect(updatedSurveyResult.answers[1].percent).toBe(0)
    })
  })
})
