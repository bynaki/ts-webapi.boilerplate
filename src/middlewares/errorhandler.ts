import {Context} from 'koa'
import {
  sendingErrorData,
} from '../utils'


export function errorHandler() {
  return async (ctx: Context, next: () => Promise<any>) => {
    try {
      await next()
    } catch(err) {
      if(ctx.websocket) {
        ctx.websocket.send(JSON.stringify(sendingErrorData(err)))
      } else {
        ctx.status = err.status || 500
        ctx.body = sendingErrorData(err)
      }
      ctx.app.emit('error', err, ctx)
    }
  }
}