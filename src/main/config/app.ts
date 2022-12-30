import setupMiddlewares from './middlewares'
let express = require('express')

const app = express()
setupMiddlewares(app)

export default app
