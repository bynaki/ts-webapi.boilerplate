import * as WebSocket from 'ws'
import * as http from 'http'
import Logger from './log'

const logger = new Logger('Socket')

let wss: WebSocket.Server
export function setupSocket(server: http.Server) {
  wss = new WebSocket.Server({server})
  wss.on('connection', (ws: WebSocket) => {
    logger.log('a user connected')
    ws.on('message', (msg: string) => {
      logger.log(`received: ${msg}`)
      ws.send(`Hello, you sent -> ${msg}`)
    })
    ws.send('Hi there, I am a WebSocket server')
  })
}