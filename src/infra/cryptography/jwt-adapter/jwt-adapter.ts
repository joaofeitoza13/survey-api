import { Encrypter } from '@/data/protocols/cryptography/encrypter'
import { Decrypter } from '@/data/protocols/cryptography/decrypter'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}

  async encrypt (plaintext: string): Promise<string> {
    const cyphertext = await jwt.sign({ sub: plaintext }, this.secret)
    return cyphertext
  }

  async decrypt (cyphertext: string): Promise<string> {
    const plaintext: any = await jwt.verify(cyphertext, this.secret)
    return plaintext
  }
}
