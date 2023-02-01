import env from '@/main/config/env'
import { setupApp } from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import { Express } from 'express'
import request from 'supertest'

let surveyCollection: Collection
let accountCollection: Collection
let app: Express

const makeAccessToken = async (): Promise<string> => {
  const id = await accountCollection.insertOne({
    name: 'João',
    email: 'joaofeitoza.13@gmail.com',
    password: '123',
    role: 'admin'
  }).then(result => result.insertedId)
  const accessToken = sign({ sub: id }, env.jwtSecret)
  await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })
  return accessToken
}

describe('SurveyResult GraphQL', () => {
  const mockedDate = new Date().toISOString()

  beforeAll(async () => {
    app = await setupApp()
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
    test('Should return a SurveyResult', async () => {
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
        .set('accountId', '')
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
      expect(response.body.data.surveyResult.date).toBe(mockedDate)
    })

    test('Should return AccessDeniedError if no token is provided', async () => {
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
      expect(response.status).toBe(403)
      expect(response.body.data).toBeFalsy()
      expect(response.body.errors[0].message).toBe('Access denied')
    })
  })

  describe('saveSurveyResult Mutation', () => {
    const saveSurveyResultMutation = (surveyId: string, answer: string): any => `
      mutation {
        saveSurveyResult (surveyId: "${surveyId}", answer: "${answer}") {
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
    test('Should return a SurveyResult', async () => {
      const accessToken: string = await makeAccessToken()
      const surveyId = await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer_1',
          image: 'http://answer-1.com'
        }, {
          answer: 'Answer_2',
          image: 'http://answer-2.com'
        }],
        date: mockedDate
      }).then(result => result.insertedId).then(result => result.toString())

      const query = saveSurveyResultMutation(surveyId, 'Answer_1')
      const response = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })

      expect(response.status).toBe(200)
      expect(response.body.data.saveSurveyResult.question).toBe('Question')
      expect(response.body.data.saveSurveyResult.answers).toEqual([{
        answer: 'Answer_1',
        count: 1,
        percent: 100,
        isCurrentAccountAnswer: true
      }, {
        answer: 'Answer_2',
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }])
      expect(response.body.data.saveSurveyResult.date).toBe(mockedDate)
    })

    test('Should return AccessDeniedError if none or invalid token is provided', async () => {
      const surveyId = await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer_1',
          image: 'http://answer-1.com'
        }, {
          answer: 'Answer_2',
          image: 'http://answer-2.com'
        }],
        date: mockedDate
      }).then(result => result.insertedId).then(result => result.toString())

      const query = saveSurveyResultMutation(surveyId, 'Answer_1')
      const response = await request(app)
        .post('/graphql')
        .send({ query })

      expect(response.status).toBe(403)
      expect(response.body.data).toBeFalsy()
      expect(response.body.errors[0].message).toBe('Access denied')
    })
  })
})
