export interface Hasher {
  hash: (plaintext: string) => Promise<string>
  // encrypt (value: string): Promise<string>
}
