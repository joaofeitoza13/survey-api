import { Decrypter } from '../../protocols/cryptography/decrypter'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (token: string, role?: string): Promise<AccountModel> {
    const decryptedToken = await this.decrypter.decrypt(token)
    if (decryptedToken) {
      const account = await this.loadAccountByTokenRepository.loadByToken(decryptedToken, role)
      if (account) {
        return account
      }
    }
    return null
  }
}
