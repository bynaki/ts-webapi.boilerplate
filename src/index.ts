import * as http from 'http'
import app from './app'
import {
  logger,
} from './log'


const port = normalizePort(process.env.PORT || 3000)

export const server = http.createServer(app.callback())
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

function normalizePort(val: number|string): number|string|boolean {
  let port: number = (typeof val === 'string')? parseInt(val) : val
  if(isNaN(port)) {
    return val
  } else if(port >= 0) {
    return port
  } else {
    return false
  }
}

function onError(error: NodeJS.ErrnoException): void {
  if(error.syscall !== 'listen') {
    logger.error(error)
    throw error
  }
  let bind = (typeof port === 'string')? `Pipe ${port}` : `Port ${port}`
  switch(error.code) {
    case 'EACCES': {
      logger.error(`${bind} requires elevated privileges`)
      process.exit(1)
      break
    }
    case 'EADDRINUSE': {
      logger.error(`${bind} is already in use`)
      process.exit(1)
      break
    }
    default: {
      logger.error(error)
      throw error
    }
  }
}

function onListening(): void {
  let addr = server.address()
  let bind = (typeof addr === 'string')? `pipe ${addr}` : `port ${addr.port}`
  logger.log(`Listening on ${bind}`)
}
