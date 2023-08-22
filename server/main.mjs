import { Console } from 'node:console'
import { existsSync, readFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { env, stderr, stdout } from 'node:process'
import express from 'express'

const app = express()
const logger = new Console(stdout, stderr)
const root = resolve('public')
const port = Number(env.APP_PORT ?? 8080)

app.use((req, res, next) => {
  const url = req.url
  const filePath = `public${url}`
  if (existsSync(filePath)) {
    if (url.endsWith('.css') || url.endsWith('.js')) {
      let fileContents = readFileSync(filePath, 'utf8')
      res.contentType(basename(filePath)).send(fileContents).end()
    }
    else { next() }
  }
  else { res.send(readFileSync('public/index.html', 'utf8')).end() }
})
app.use(express.static(root, { redirect: false }))

app.listen(port)

logger.info(`Server started on port <${port}>`)
