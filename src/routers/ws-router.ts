import {
  BaseRouter,
  All,
  Prefix,
  Before,
  IContext,
  INext,
  KoaRouter,
  BeforeEachWith,
} from 'koa-decorouter'
import { ErrorNotFound } from '../errors';
import {
  KoaWebsocketMiddlewareContext,
} from 'koa-websocket'
import Logger from '../log'
import { getDecodedToken } from '../middlewares';


const l = new Logger('Websocket')

@Prefix('/v1/ws')
class WebsocketRouter extends BaseRouter {
  @All('/')
  connect(ctx: KoaWebsocketMiddlewareContext, next: INext) {
    const ws = ctx.websocket
    l.log(`a user connected at ${ctx.url}`)
    ws.send('I am a Websocket server.')
  }

  @All('/echo')
  echo(ctx: KoaWebsocketMiddlewareContext, next: INext) {
    const ws = ctx.websocket
    l.log(`a user connected at ${ctx.url}`)
    ws.on('message', data => {
      ws.send(data)
    })
  }

  @All('/json')
  json(ctx: KoaWebsocketMiddlewareContext, next: INext) {
    const ws = ctx.websocket
    l.log(`a user connected at ${ctx.url}`)
    ws.on('message', msg => {
      const data = JSON.parse(msg.toString())
      switch(data.message) {
        case 'hello': {
          ws.send(JSON.stringify({
            message: data.message,
            data: 'I am glad to see you.',
            error: null,
          }))
          break
        }
        default: {
          throw new Error('I am not understanding your message.')
        }
      }
    })
  }

  @All('/:user')
  @Before('certify')
  auth(ctx: KoaWebsocketMiddlewareContext, next: INext) {
    const ws = ctx.websocket
    ws.on('message', (msg: string) => {
      l.log(`received: ${msg}`)
      ws.send(`You sent -> ${msg}`)
    })
    ws.send(`Hi ${ctx.params.user}, I am a Websocket server.`)
  }

  certify(ctx: KoaWebsocketMiddlewareContext, next: INext) {
    const decoded = getDecodedToken(ctx)
    console.log('decoded: ', decoded)
  }
}

export default new WebsocketRouter().router