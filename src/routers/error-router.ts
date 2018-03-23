import {
  BaseRouter,
  Get,
  Prefix,
  IContext,
  INext,
  KoaRouter,
} from 'koa-decorouter'
import {
  ErrorBadRequest,
  ErrorUnauthorized,
} from '../errors'

@Prefix('/v1/error')
class ErrorRouter extends BaseRouter {
  constructor() {
    super()
  }

  @Get('/internal')
  internalError(ctx: IContext, next: INext) {
    throw new Error('Internal Error!!')
  }

  @Get('/badrequest')
  badRequestError(ctx: IContext, next: INext) {
    throw new ErrorBadRequest('Bad Request Error!!')
  }

  @Get('/unauthorized')
  unauthorizedError(ctx: IContext, next: INext) {
    throw new ErrorUnauthorized('Unauthorized Error!!')
  }
}

export default new ErrorRouter().router