import { MongoHelper } from '@/infra/db'
import { AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository } from '@/data/protocols/db'
import { ObjectId } from 'mongodb'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
  async add (data: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const accountId = await accountCollection.insertOne(data)
      .then(result => result.insertedId)
    const fetchedAccount = await accountCollection.findOne({ _id: accountId })
    return fetchedAccount !== null
  }

  async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({
      email
    }, {
      projection: {
        _id: 1,
        name: 1,
        password: 1
      }
    })
    return account && MongoHelper.map(account)
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({
      _id: new ObjectId(id)
    }, {
      $set: {
        accessToken: token
      }
    })
  }

  async loadByToken (token: string, role?: string): Promise<LoadAccountByTokenRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({
      accessToken: token,
      $or: [{
        role
      }, {
        role: 'admin'
      }]
    }, {
      projection: { _id: 1 }
    })
    return account && MongoHelper.map(account)
  }
}
