import app from './app'
import Logger from './log'


const l = new Logger('Server')
const port = normalizePort(process.env.PORT || 3000)

// error handler
app.on('error', err => {
  l.error(err)
  l.log(`sent error "${err.message}" to the client`)
})

// listening
app.listen(port, () => {
  l.log(`Listening on port ${port}`)
})

function normalizePort(val: number|string): number|string|boolean {
  const port: number = (typeof val === 'string')? parseInt(val) : val
  if(isNaN(port)) {
    return val
  } else if(port >= 0) {
    return port
  } else {
    return false
  }
}