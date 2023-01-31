import env from '@/main/config/env'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import request from 'supertest'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (role?: string): Promise<string> => {
  const id = await accountCollection.insertOne({
    name: 'João',
    email: 'joaofeitoza.13@gmail.com',
    password: '123',
    role
  }).then(result => result.insertedId)
  const accessToken = sign({ sub: id }, env.jwtSecret)
  await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })
  return accessToken
}

describe('SurveyResult GraphQL', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('SurveyResult Query', () => {
    const surveyResultQuery = (surveyId: string): any => `
      query {
        surveyResult (surveyId: "${surveyId}") {
          question
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }
    `
    test('Should return SurveyResult', async () => {
      const mockedDate = new Date()
      const accessToken: string = await makeAccessToken()
      const surveyId = await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'http://answer-1.com'
        }, {
          answer: 'Answer 2',
          image: 'http://answer-2.com'
        }],
        date: mockedDate
      }).then(result => result.insertedId).then(result => result.toString())
      const query = surveyResultQuery(surveyId)
      const response = await request(app)
        .post('/graphql')
        .send({ query })
        .set('x-access-token', accessToken)
      expect(response.status).toBe(200)
      expect(response.body.data.surveyResult.question).toBe('Question')
      expect(response.body.data.surveyResult.answers).toEqual([{
        answer: 'Answer 1',
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }, {
        answer: 'Answer 2',
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }])
      expect(response.body.data.surveyResult.date).toBe(mockedDate.toISOString())
    })
  })
})
