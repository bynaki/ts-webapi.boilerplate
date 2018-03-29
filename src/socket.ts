import { Server } from 'http'
import * as IO from 'socket.io'
import Logger from './log'

const l = new Logger('Socket')

function isValid(token: string) {
  return token === 'foobar'
}

export function setupSocket(server: Server) {
  const io = IO(server)

  // auth를 위하여
  io.use((client, next) => {
    const token = client.handshake.query.token
    if(isValid(token)) {
      client['_token'] = token
      return next()
    }
    // client에게 'error' event 전달
    next(new Error('Unauthorized'))
  })

  io.on('connection', client => {
    l.log('a user connected')

    function wrap(target: (...args: any[]) => Promise<void>|void) {
      return async (...args: any[]) => {
        try {
          await target(...args)
        } catch(err) {
          l.error(err)
          client.emit(':error', {
            message: err.message,
            name: err.name,
            stack: err.stack
          })
        }
      }
    }

    client.on('disconnect', () => {
      l.log('user disconnected')
    });
    client.send('I am a Socket Server.')
    
    client.on(':echo', wrap(data => {
      client.emit(':echo', data)
    }))
    client.on(':trigger-error', wrap(data => {
      throw new Error('trigger error')
    }))

    client.on('error', err => {
      l.error(err)
    })
  })
}



