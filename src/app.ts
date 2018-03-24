import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import {
  responseTime,
  responseLogger,
  authentication,
} from './middlewares'
import {
  ErrorWithStatusCode,
  ErrorNotFound,
} from './errors'
import {
  logger,
} from './log'
import cf from './config'

import errorRouter from './routers/error-router'
import heroRouter from './routers/hero-router'
import authRouter from './routers/auth-router'

const app = new Koa()

// look ma, error propagation!
app.use(async (ctx, next) => {
  try {
    await next()
  } catch(e) {
    const err: ErrorWithStatusCode = e
    ctx.status = err.status || 500
    ctx.body = {
      data: null,
      error: {
        message: err.message,
        name: err.name,
        stack: err.stack,
        status: err.status,
      },
    }
    ctx.app.emit('error', err, ctx)
  }
})

// body parser (for post method)
// ex. ctx.request.body
app.use(bodyParser())

// x-response-time
app.use(responseTime())

// logger
app.use(responseLogger('Response'))

// authentication
app.use(authentication(cf.jwt))

// register routers
app.use(errorRouter.routes())
app.use(errorRouter.allowedMethods())
app.use(heroRouter.routes())
app.use(heroRouter.allowedMethods())
app.use(authRouter.routes())
app.use(authRouter.allowedMethods())

// not found
app.use(ctx => {
  throw new ErrorNotFound(`requested ${ctx.method} ${ctx.url}`)
})

// error handler
app.on('error', err => {
  logger.log(`sent error "${err.message}" to the client`)
  logger.error(err)
})

export default app