export interface Decrypter {
  decrypt: (cyphertext: string) => Promise<string>
}
