import * as Koa from 'koa'
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
import routeRouter from './routers/route-router'

const app = new Koa()

// look ma, error propagation!
app.use(async (ctx, next) => {
  try {
    await next()
  } catch(e) {
    const err: ErrorWithStatusCode = e
    ctx.status = err.statusCode || 500
    ctx.type = 'json'
    ctx.body = {
      errorMessage: err.message,
      errorName: err.name,
      errorStack: err.stack,
    }
    ctx.app.emit('error', err, ctx)
  }
})

// x-response-time
app.use(responseTime())

// logger
app.use(responseLogger('Response'))

// authentication
app.use(authentication(cf.jwt))

// register routers
// app.use(errorRouter.routes())
// app.use(errorRouter.allowedMethods())
// app.use(heroRouter.routes())
// app.use(heroRouter.allowedMethods())
app.use(routeRouter.routes())
app.use(routeRouter.allowedMethods())

// not found
app.use(ctx => {
  throw new ErrorNotFound(`requested ${ctx.method} ${ctx.url}`)
})

export default app

// error handler
app.on('error', err => {
  logger.log(`sent error "${err.message}" to the client`)
  logger.error(err)
})
