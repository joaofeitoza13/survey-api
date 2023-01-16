import { Decrypter } from '../../protocols/cryptography/decrypter'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    const decryptedToken = await this.decrypter.decrypt(accessToken)
    if (decryptedToken) {
      await this.loadAccountByTokenRepository.loadByToken(decryptedToken, role)
    }
    return null
  }
}
