import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData).then(result => result.insertedId)
    const account = await MongoHelper.getCollection('accounts').findOne({ _id: result }).then(data => data)
    const { _id, name, email, password } = account
    return Object.assign({}, { id: _id.toString(), name, email, password })
  }
}
