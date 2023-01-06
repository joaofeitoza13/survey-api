export interface Hasher {
  hash: (value: string) => Promise<string>
  // encrypt (value: string): Promise<string>
}
