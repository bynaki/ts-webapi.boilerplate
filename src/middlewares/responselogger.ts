import {
  Logger,
} from '../log'
import {
  Context,
} from 'koa'

export function responseLogger(name: string) {
  const l = new Logger(name)
  return async (ctx: Context, next: () => Promise<any>) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    l.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
  }
}