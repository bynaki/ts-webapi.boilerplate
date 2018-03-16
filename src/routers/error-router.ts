import {
  BaseRouter,
  Get,
  Prefix,
  IContext,
  INext,
  KoaRouter,
} from '../router'


@Prefix('/v1/error')
class ErrorRouter extends BaseRouter {
  constructor() {
    super()
  }

  @Get('/internal')
  internalError(ctx: IContext, next: INext) {
    throw new Error('Internal Error!!')
  }
}

export default new ErrorRouter().router