import app from '@/main/config/app'
import env from '@/main/config/env'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import request from 'supertest'

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

describe('Survey Routes', () => {
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

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })

    test('Should return 200 on save survey with valid accessToken', async () => {
      const accessToken = await makeAccessToken()
      const surveyId = await surveyCollection.insertOne({
        question: 'question',
        answers: [{
          answer: 'answer 1',
          image: 'http://image-name.com'
        }, {
          answer: 'answer 2',
          image: 'http://image-name2.com'
        }],
        date: new Date()
      }).then(result => result.insertedId)
      const id = surveyId.toString()
      await request(app)
        .put(`/api/surveys/${id}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'answer 2'
        })
        .expect(200)
    })
  })

  describe('GET /surveys/:surveyId/results', () => {
    test('Should return 403 on load survey result without accessToken', async () => {
      await request(app)
        .get('/api/surveys/any_id/results')
        .expect(403)
    })

    test('Should return 200 on save survey with valid accessToken', async () => {
      const accessToken = await makeAccessToken()
      const surveyId = await surveyCollection.insertOne({
        question: 'question',
        answers: [{
          answer: 'answer 1',
          image: 'http://image-name.com'
        }, {
          answer: 'answer 2',
          image: 'http://image-name2.com'
        }],
        date: new Date()
      }).then(result => result.insertedId)
      const id = surveyId.toString()
      await request(app)
        .get(`/api/surveys/${id}/results`)
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
