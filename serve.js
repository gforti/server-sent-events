const EventEmitter = require('events');
const express = require('express');
const app = express();
const port = process.env.port || 9000
const root = __dirname
const Stream = new EventEmitter();

const Nouns = require('./nouns')

const fallback = (...pathOptions) => (req, res, next) => {
  if ((req.method === 'GET' || req.method === 'HEAD') && req.accepts('html')) {
    res.sendFile.call(res, ...pathOptions, error => error && next())
  } else next()
}

app.use(express.static(root))
//app.use(fallback('index.html', { root }))
app.get('/', function(request, response){
  response.render('index.html', {})
})

let timer = setInterval(() => {
    const randNoun = Math.floor(Math.random() * Nouns.length)
    Stream.emit('push', 'test', { msg: Nouns[randNoun] })
  }, 5000)

app.get('/stream', function(request, response){
  response.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Content-Type': 'text/event-stream',
  })

  Stream.on("push", function(event, data) {
    response.write(`event: ${String(event)}\n`)
    //response.write(`id: ${new Date().getTime()}\n`)
    response.write(`data: ${JSON.stringify(data)}`)
    response.write('\n\n')
  })

})

let httpInstance = app.listen(port)

process.on('SIGINT', () => {
  console.log('gracefully shutting down')
  httpInstance.close()
  clearInterval(timer)
  process.exit(0)
})
