import {
  BaseRouter,
  Get,
  Prefix,
  IContext,
  INext,
  IMiddleware,
  KoaRouter,
  Before,
  BeforeEach,
  BeforeEachWith,
} from '../router'
import { ErrorUnauthorized } from '../errors';


@Prefix('/v1/router')
@BeforeEachWith(async (ctx: IContext, next: INext) => {
  ctx.order || (ctx.order = [])
  ctx.order.push(3)
  await next()
  ctx.order.push(9)
})
@BeforeEachWith(async (ctx: IContext, next: INext) => {
  ctx.order || (ctx.order = [])
  ctx.order.push(2)
  await next()
  ctx.order.push(10)
})
class RouteRouter extends BaseRouter {
  constructor() {
    super()
  }

  @BeforeEach()
  async beforeEach(ctx: IContext, next: INext) {
    ctx.order || (ctx.order = [])
    ctx.order.push(0)
    await next()
    ctx.order.push(12)
  }

  @BeforeEach()
  async beforeEach2(ctx: IContext, next: INext) {
    ctx.order || (ctx.order = [])
    ctx.order.push(1)
    await next()
    ctx.order.push(11)
  }

  async before(ctx: IContext, next: INext) {
    ctx.order || (ctx.order = [])
    ctx.order.push(4)
    await next()
    ctx.order.push(8)
  }

  @Before(async (ctx: IContext, next: INext) => {
    ctx.order || (ctx.order = [])
    ctx.order.push(5)
    await next()
    ctx.order.push(7)
  })
  @Before('before')
  @Get('/order')
  order(ctx: IContext, next: INext) {
    ctx.order || (ctx.order = [])
    ctx.order.push(6)
    ctx.body = ctx.order
  }

  @Before((ctx: IContext, next: INext) => {
    if(ctx.params.name !== 'goodguy') {
      throw new ErrorUnauthorized('Bad Guy!!')
    }
    next()
  })
  @Get('/user/:name')
  goodguy(ctx: IContext, next: INext) {
    ctx.body = 'Good Guy!!'
  }

  @Get('/:to/:path')
  toPath(ctx: IContext, next: INext) {
    ctx.body = {
      to: ctx.params.to,
      path: ctx.params.path,
    }
  }
}

export default new RouteRouter().router
