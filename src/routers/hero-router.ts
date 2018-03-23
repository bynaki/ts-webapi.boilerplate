import {
  BaseRouter,
  Get,
  Prefix,
  IContext,
  INext,
  KoaRouter,
} from 'koa-decorouter'
import { ErrorNotFound } from '../errors';


@Prefix('/v1/heroes')
class HeroRouter extends BaseRouter {
  heroes: any[] = require('../hero.json')

  constructor() {
    super()
  }

  @Get('/')
  getAll(ctx: IContext, next: INext) {
    ctx.body = {
      data: this.heroes,
      error: null,
    }
  }

  @Get('/:id')
  getOne(ctx: IContext, next: INext) {
    const id = Number(ctx.params.id)
    const hero = this.heroes.find(hero => hero.id === id)
    if(hero) {
      ctx.body = {
        data: hero,
        error: null,
      }
    } else {
      throw new ErrorNotFound('No hero found with the given id.')
    }
  }
}

export default new HeroRouter().router