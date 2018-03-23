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
  getDecodedToken,
} from '../middlewares/authentication'


function auth(...permissions: string[]) {
  return (ctx: IContext, next: INext) => {
    const decoded = getDecodedToken(ctx)
    if(decoded && decoded.user && (decoded.user === ctx.params.user)) {
      decoded.permissions = decoded.permissions || []
      if(permissions.indexOf('read') !== -1 
        && decoded.permissions.indexOf('read') === -1) {
        throw new ErrorUnauthorized('You have no authority.')
      }
      if(permissions.indexOf('write') !== -1 
        && decoded.permissions.indexOf('write') === -1) {
        throw new ErrorUnauthorized('You have no authority.')
      }
    } else {
      throw new ErrorUnauthorized('You are not me.')
    }
    next()
  }
}

@Prefix('/v1/auth')
class AuthRouter extends BaseRouter {
  @Before(auth())
  @Get('/:user')
  user(ctx: IContext, next: INext) {
    ctx.body = {
      data: `Welcome, ${ctx.params.user}`,
      error: null,
    }
  }
  
  @Before(auth('read'))
  @Get('/:user/do')
  read(ctx: IContext, next: INext) {
    ctx.body = {
      data: 'You can read it.',
      error: null,
    }
  }

  @Before(auth('write'))
  @Post('/:user/do')
  write(ctx: IContext, next: INext) {
    ctx.body = {
      data: 'You can write it.',
      error: null,
    }
  }
}

export default new AuthRouter().router