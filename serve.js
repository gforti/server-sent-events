const express = require('express')
const app = express()
const port = process.env.port || 9000
const root = __dirname

app.use(express.static(root))
app.get('/', function (request, response) {
  response.render('index.html', {})
})

let httpInstance = app.listen(port)

process.on('SIGINT', async () => {
  console.log('gracefully shutting down')
  clearInterval(timer)
  await closeConnections('test')
  httpInstance.close()
  process.exit(0)
})
