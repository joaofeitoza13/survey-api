import { Hasher } from '@/data/protocols/cryptography/hasher'
import { Decrypter } from '@/data/protocols/cryptography/decrypter'
import { Encrypter } from '@/data/protocols/cryptography/encrypter'
import { HashComparer } from '@/data/protocols/cryptography/hash-comparer'
import { faker } from '@faker-js/faker'

export class HasherSpy implements Hasher {
  digest = faker.datatype.uuid()
  plaintext: string

  async hash (plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return this.digest
  }
}

export class HashComparerSpy implements HashComparer {
  digest: string
  plaintext: string
  isValid = true

  async compare (plaintext: string, digest: string): Promise<boolean> {
    this.digest = digest
    this.plaintext = plaintext
    return Promise.resolve(this.isValid)
  }
}

export class DecrypterSpy implements Decrypter {
  cyphertext: string
  plaintext = faker.internet.password()
  async decrypt (cyphertext: string): Promise<string> {
    this.cyphertext = cyphertext
    return this.plaintext
  }
}

export class EncrypterSpy implements Encrypter {
  cyphertext = faker.datatype.uuid()
  plaintext: string
  async encrypt (plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return Promise.resolve(this.cyphertext)
  }
}
