import {
  BaseRouter,
  Get,
  Prefix,
  IContext,
  INext,
  KoaRouter,
  Before,
  BeforeEach,
  BeforeEachWith,
  After,
  AfterEach,
  AfterEachWith,
  IMiddleware,
} from '../router'


@Prefix('/v1/beforeafter')
@BeforeEachWith(async (ctx: IContext, next: INext) => {
  ctx.order || (ctx.order = [])
  ctx.order.push(0)
  await next()
  ctx.order.push(11)
})
@BeforeEachWith(async (ctx: IContext, next: INext) => {
  ctx.order || (ctx.order = [])
  ctx.order.push(1)
  await next()
  ctx.order.push(10)
})
class BeforeAfterRouter extends BaseRouter {
  constructor() {
    super()
  }

  @BeforeEach()
  async beforeEach(ctx: IContext, next: INext) {
    ctx.order || (ctx.order = [])
    ctx.order.push(3)
    await next()
    ctx.order.push(9)
  }

  @Before(async (ctx: IContext, next: INext) => {
    ctx.order || (ctx.order = [])
    ctx.order.push(4)
    await next()
    ctx.order.push(8)
  })
  @Before('before')
  @Get('/order')
  order(ctx: IContext, next: INext) {
    ctx.order || (ctx.order = [])
    ctx.order.push(6)
    ctx.body = ctx.order
  }

  async before(ctx: IContext, next: INext) {
    ctx.order || (ctx.order = [])
    ctx.order.push(5)
    await next()
    ctx.order.push(7)
  }
}

export default new BeforeAfterRouter().router
