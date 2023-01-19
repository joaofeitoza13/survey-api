import { SurveyMongoRepository } from './survey-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'

let surveyCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

const insertSurveyList = async (): Promise<void> => {
  await surveyCollection.insertMany([{
    id: 'id_1',
    question: 'question_1',
    answers: [{
      image: 'image_1',
      answer: 'answer_1'
    }],
    date: new Date()
  }, {
    id: 'id_2',
    question: 'question_2',
    answers: [{
      image: 'image_2',
      answer: 'answer_2'
    }],
    date: new Date()
  }, {
    id: 'id_3',
    question: 'question_3',
    answers: [{
      image: 'image_3',
      answer: 'answer_3'
    }],
    date: new Date()
  }])
}

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut()
      await sut.add({
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }, {
          answer: 'other_answer'
        }],
        date: new Date()
      })
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      await insertSurveyList()
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(3)
      expect(surveys[0].question).toBe('question_1')
      expect(surveys[2].question).toBe('question_3')
    })

    test('Should load empty list', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })
  })
})
