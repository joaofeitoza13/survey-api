import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const accountId = await accountCollection.insertOne(accountData)
      .then(result => result.insertedId)
    const fetchedAccount = await accountCollection.findOne({ _id: accountId })
    return MongoHelper.map(fetchedAccount)
  }
}
