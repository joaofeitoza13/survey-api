import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
// import { AddSurveyModel } from '../../../../domain/usecases/add-survey'

let surveyCollection: Collection

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
  })

  // const makeFakeSurveyData = (): AddSurveyModel => ({
  //   question: 'any_question',
  //   answers: [{
  //     image: 'any_image',
  //     answer: 'any_answer'
  //   }]
  // })

  const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
  }

  test('Should returns a survey add success', async () => {
    const sut = makeSut()
    await sut.add({
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }, {
        answer: 'other_answer'
      }]
    })
    const survey = await surveyCollection.findOne({ question: 'any_question' })
    expect(survey).toBeNull()
  })
})
