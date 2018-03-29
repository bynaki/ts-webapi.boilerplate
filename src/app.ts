import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import {
  responseTime,
  responseLogger,
  authentication,
  errorHandler,
} from './middlewares'
import {
  ErrorWithStatusCode,
  ErrorNotFound,
} from './errors'
import Logger from './log'
import cf from './config'

import errorRouter from './routers/error-router'
import heroRouter from './routers/hero-router'
import authRouter from './routers/auth-router'


const l = new Logger('Server')
const app = new Koa()

// look ma, error propagation!
app.use(errorHandler())

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

export default app