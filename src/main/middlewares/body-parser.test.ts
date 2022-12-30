import app from '../config/app'
// eslint-disable-next-line @typescript-eslint/no-var-requires
let request = require('supertest')

describe('Body Parser Middleware', () => {
  test('Should parse body as json', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })
    await request(app)
      .post('/test_body_parser')
      .send({ name: 'João' })
      .expect({ name: 'João' })
  })
})
