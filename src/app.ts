import express from 'express'

export function createApp() {
  const app = express()

  app.use(express.json())

  app.get('/health', (_request, response) => {
    response.json({
      status: 'ok'
    })
  })

  app.get('/api/users', (_request, response) => {
    response.json({
      data: []
    })
  })

  return app
}
