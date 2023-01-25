import express, { Express } from 'express'
import { resolve } from 'path'

// TODO understand what is happening here
export default (app: Express): void => {
  app.use('/static', express.static(resolve(__dirname, '@/testsstatic')))
}
