import path from 'path'
import { readdirSync } from 'fs'
import { Express, Router } from 'express'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  readdirSync(path.join(__dirname, './../routes')).map(async file => {
    if (!file.includes('.test.') && !file.endsWith('.map')) {
      (await import(`../routes/${file}`)).default(router)
    }
  })
}
