import { ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository'
import { AccountModel, AddAccountModel } from '../../../../data/usecases/add-account/db-add-account-protocols'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const accountId = await accountCollection.insertOne(accountData)
      .then(result => result.insertedId)
    const fetchedAccount = await accountCollection.findOne({ _id: accountId })
    return MongoHelper.map(fetchedAccount)
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    return MongoHelper.map(account)
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
}
