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

describe('Surveys GraphQl', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('Survey Query', () => {
    const query = `
      query {
        surveys {
          id
          question
          answers {
            image
            answer
          }
          date
          didAnswer
        }
      }
    `
    test('Should return surveys', async () => {
      const mockedDate = new Date()
      const accessToken = await makeAccessToken()
      await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'http://answer-1.com'
        }, {
          answer: 'Answer 2',
          image: 'http://answer-2.com'
        }],
        date: mockedDate
      }).then(result => result.insertedId)
      const response = await request(app)
        .post('/graphql')
        .send({ query })
        .set('x-access-token', accessToken)
      expect(response.status).toBe(200)
      expect(response.body.data.surveys.length).toBe(1)
      expect(response.body.data.surveys[0].id).toBeTruthy()
      expect(response.body.data.surveys[0].question).toBe('Question')
      expect(response.body.data.surveys[0].answers).toEqual([{
        answer: 'Answer 1',
        image: 'http://answer-1.com'
      }, {
        answer: 'Answer 2',
        image: 'http://answer-2.com'
      }])
      expect(response.body.data.surveys[0].date).toBe(mockedDate.toISOString())
    })

    test('Should return surveys', async () => {
      const mockedDate = new Date()
      await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'http://answer-1.com'
        }, {
          answer: 'Answer 2',
          image: 'http://answer-2.com'
        }],
        date: mockedDate
      }).then(result => result.insertedId)
      const response = await request(app)
        .post('/graphql')
        .send({ query })
      expect(response.status).toBe(403)
      expect(response.body.errors[0].message).toBe('Access denied')
    })
  })
})
