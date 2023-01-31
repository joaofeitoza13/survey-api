import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import request from 'supertest'

let accountCollection: Collection

describe('Login GraphQL', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('Login Query', () => {
    const query = `
      query {
        login (email: "joao@email.com", password: "123") {
          accessToken
          name
        }
      }
    `
    test('Should return an account on valid credentials', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'João',
        email: 'joao@email.com',
        password
      })
      const response = await request(app)
        .post('/graphql')
        .send({ query })
      expect(response.status).toBe(200)
      expect(response.body.data.login.accessToken).toBeTruthy()
      expect(response.body.data.login.name).toBe('João')
    })
  })
})
