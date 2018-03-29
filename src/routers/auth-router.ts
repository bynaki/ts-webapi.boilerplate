import {
  BaseRouter,
  Get,
  Post,
  Prefix,
  Before,
  IContext,
  INext,
  KoaRouter,
} from 'koa-decorouter'
import {
  ErrorBadRequest,
  ErrorUnauthorized,
} from '../errors'
import {
  certify,
} from '../middlewares/authentication'


@Prefix('/v1/auth')
class AuthRouter extends BaseRouter {
  @Before(certify())
  @Get('/:user')
  user(ctx: IContext, next: INext) {
    ctx.body = {
      data: `Welcome, ${ctx.params.user}`,
      error: null,
    }
  }
  
  @Before(certify('read'))
  @Get('/:user/do')
  read(ctx: IContext, next: INext) {
    ctx.body = {
      data: 'You can read it.',
      error: null,
    }
  }

  @Before(certify('write'))
  @Post('/:user/do')
  write(ctx: IContext, next: INext) {
    ctx.body = {
      data: 'You can write it.',
      error: null,
    }
  }
}

export default new AuthRouter().router