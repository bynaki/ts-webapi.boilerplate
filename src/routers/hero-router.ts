import {
  BaseRouter,
  Get,
  Prefix,
  IContext,
  INext,
  KoaRouter,
} from '../router'


@Prefix('/v1/heroes')
class HeroRouter extends BaseRouter {
  heroes: any[] = require('../hero.json')

  constructor() {
    super()
  }

  @Get('/')
  getAll(ctx: IContext, next: INext) {
    ctx.body = this.heroes
  }
}

export default new HeroRouter().router