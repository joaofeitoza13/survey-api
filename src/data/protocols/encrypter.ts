export interface Encrypter {
  encrypt: (value: string) => Promise<string>
  // encrypt (value: string): Promise<string>
}
