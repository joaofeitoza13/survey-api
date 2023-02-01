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
    accountCollection = MongoHelper.getCollection('accounts')
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

    test('Should return unauthorized error on invalid credentials', async () => {
      const response: any = await request(app)
        .post('/graphql')
        .send({ query })
      expect(response.status).toBe(401)
      expect(response.body.errors[0].message).toBe('Unauthorized')
    })
  })

  describe('SignUp Mutation', () => {
    const query = `
      mutation {
        signUp (name: "João Bisneto", email: "joao@email.com", password: "123", passwordConfirmation: "123") {
          accessToken
          name
        }
      }
    `
    test('Should return an account on valid data', async () => {
      const response: any = await request(app)
        .post('/graphql')
        .send({ query })
      expect(response.status).toBe(200)
      expect(response.body.data.signUp.accessToken).toBeTruthy()
      expect(response.body.data.signUp.name).toBe('João Bisneto')
    })

    test('Should return EmailInUseError on invalid data', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'João',
        email: 'joao@email.com',
        password
      })
      const response: any = await request(app)
        .post('/graphql')
        .send({ query })
      expect(response.status).toBe(403)
      expect(response.body.data).toBeFalsy()
      expect(response.body.errors[0].message).toBe('The received email is already in use')
    })
  })
})
