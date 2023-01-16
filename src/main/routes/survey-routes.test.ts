import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'

let surveyCollection: Collection

describe('Survey Routes', () => {
  beforeAll(async () => {
    console.log(process.env.MONGO_URL)
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  test('Should return 204 on add survey success', async () => {
    await request(app)
      .post('/api/surveys')
      .send({
        question: 'question',
        answers: [{
          answer: 'answer 1',
          image: 'http://image-name.com'
        }, {
          answer: 'answer 2'
        }]
      })
      .expect(204)
  })
})
