import { createApp } from '~/app'
import { env } from '~/env'

const app = createApp()

app.listen(env.APP_PORT, env.APP_HOST, () => {
  console.log(`Server started: http://${env.APP_HOST}:${env.APP_PORT}`)
})
