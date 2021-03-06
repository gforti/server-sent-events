const EventEmitter = require('events')
const express = require('express')
const { performance } = require('perf_hooks')
const app = express()
const port = process.env.port || 9001
const root = __dirname
const Stream = new EventEmitter()

const Nouns = require('./nouns')
const EVENT_TYPE = 'test'

const fallback = (...pathOptions) => (req, res, next) => {
  if ((req.method === 'GET' || req.method === 'HEAD') && req.accepts('html')) {
    res.sendFile.call(res, ...pathOptions, error => error && next())
  } else next()
}

function generateUUID() {
  return String(new Date().getTime() + performance.now()).replace('.', '-')
}
let resConnections = new Map()

Stream.on('push', (event, data) => {
  resConnections.forEach((res) => {
    if (!res || res.finished) return
    res.write(`event: ${String(event)}\n`)
    res.write(`id: ${new Date().getTime()}\n`)
    res.write(`data: ${JSON.stringify(data)}\n`)
    res.write('retry: 10000\n')
    res.write('\n')
  })
})

function closeConnections(event) {
  return new Promise(resolve => {
    resConnections.forEach((res) => {
      if (!res || res.finished) return
      res.write(`event: ${String(event)}\n`)
      res.write(`id: CLOSE\n`)
      res.write(`data: close\n`)
      res.write('\n')
      res.end()
    })
    console.log('End Stream')
    resolve(true)
  })
}

app.use(express.static(root))
//app.use(fallback('index.html', { root }))


let timer = setInterval(() => {
  const randNoun = Math.floor(Math.random() * Nouns.length)
  Stream.emit('push', EVENT_TYPE, { msg: Nouns[randNoun] })
}, 5000)

app.get('/stream', function (request, response) {
  response.writeHead(200, {
    'Access-Control-Allow-Origin': 'http://localhost:9000',
    'Access-Control-Allow-Credentials': true,
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Content-Type': 'text/event-stream',
  })

  console.log(request.headers.cookie)
  console.log(request.headers.origin)

  if (request.headers['last-event-id']) {
    const eventId = parseInt(request.headers['last-event-id'])
    console.log(eventId)
  }

  // This might not be needed with HTTP/2.0
  const clientID = generateUUID()
  resConnections.set(clientID, response)

  request.on('close', () => {
    if (!response.finished) {
      response.end()
      resConnections.delete(clientID)
      console.log('Stopped sending events to', clientID)
    }
  })

})

let httpInstance = app.listen(port)

process.on('SIGINT', async () => {
  console.log('gracefully shutting down')
  clearInterval(timer)
  await closeConnections(EVENT_TYPE)
  httpInstance.close()
  process.exit(0)
})
