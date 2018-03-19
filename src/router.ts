/**
 * Router using Decorator
 */

import {
  ErrorUnauthorized,
} from './errors'
import * as KoaRouter from 'koa-router'
import {
  IRouterContext,
  IMiddleware,
} from 'koa-router'

export {
  KoaRouter,
  IMiddleware,
}
export type IContext = IRouterContext
export type INext = () => Promise<any>

interface IEndpointInfo {
  method: string
  path: string|RegExp
  middleware: string
}


export class BaseRouter {
  private _prefix: string
  private _beforeEachs: IMiddleware[]
  private _befores: {[index: string]: IMiddleware[]}
  private _endpoints: IEndpointInfo[]
  private _router: KoaRouter

  constructor() {
    this._router = new KoaRouter({prefix: this._prefix})
    this._beforeEachs || (this._beforeEachs = [])
    this._befores || (this._befores = {})
    this._endpoints || (this._endpoints = [])

    this._beforeEachs = this._beforeEachs.map(b => {
      return (typeof b === 'string')? this[b].bind(this) : b
    })
    Object.keys(this._befores).forEach(name => {
      this._befores[name] = this._befores[name].map(b => {
        return (typeof b === 'string')? this[b].bind(this) : b
      })
    })
    this._endpoints.forEach(e => {
      this._befores[e.middleware] || (this._befores[e.middleware] = [])
      const middlewares = [].concat(this._beforeEachs)
        .concat(this._befores[e.middleware])
        .concat(this[e.middleware].bind(this))
      this.router[e.method](e.path, ...middlewares)
    })
    // if(this['routerItemList']) {
    //   let list: IEndpointInfo[] = this['routerItemList']
    //   list.forEach(item => {
    //     this.router[item.method](item.path, this[item.middleware].bind(this))
    //   })
    // }
  }

  get router() {
    return this._router
  }
}


export function Prefix(prefix: string) {
  return (target: any) => {
    target.prototype._prefix = prefix
  }
}

export function BeforeEachWith(middleware: IMiddleware) {
  return (target: any) => {
    target.prototype._beforeEachs || (target.prototype._beforeEachs = [])
    target.prototype._beforeEachs.push(middleware)
  }
}

// export function AfterEachWith(middleware: IMiddleware) {
//   return (target: any) => {
//     target.prototype._afterEachs || (target.prototype._afterEachs = [])
//     target.prototype._afterEachs.push(middleware)
//   }
// }

export function BeforeEach() {
  return (target: any, name: string, descriptor: PropertyDescriptor) => {
    target._beforeEachs || (target._beforeEachs = [])
    target._beforeEachs.push(name)
  }
}

// export function AfterEach() {
//   return (target: any, name: string, descriptor: PropertyDescriptor) => {
//     target._afterEachs || (target._afterEachs = [])
//     target._afterEachs.push(name)
//   }
// }

export function Before(middleware: IMiddleware|string) {
  return (target: any, name: string, descriptor: PropertyDescriptor) => {
    target._befores || (target._befores = {})
    target._befores[name] || (target._befores[name] = [])
    target._befores[name].push(middleware)
  }
}

// export function After(middleware: IMiddleware|string) {
//   return (target: any, name: string, descriptor: PropertyDescriptor) => {
//     target._afters || (target._afters = {})
//     target._afters[name] || (target._afters[name] = [])
//     target._afters[name].push(middleware)
//   }
// }

function Method(method: string
  , path: string|RegExp, withAuth: boolean = false) {
  return (target: any, name: string, descriptor: PropertyDescriptor) => {
    if(!target._endpoints) {
      target._endpoints = []
    }
    let list: IEndpointInfo[] = target._endpoints
    list.push({
      method,
      path,
      middleware: name,
    })
  }
}

export function All(path: string|RegExp) {
  return Method('all', path)
}

export function Get(path: string|RegExp) {
  return Method('get', path)
}

export function Post(path: string|RegExp) {
  return Method('post', path)
}

export function Put(path: string|RegExp) {
  return Method('put', path)
}

export function Delete(path: string|RegExp) {
  return Method('del', path)
}

export function Head(path: string|RegExp) {
  return Method('head', path)
}

export function Patch(path: string|RegExp) {
  return Method('patch', path)
}

export function AllAuth(path: string|RegExp) {
  return Method('all', path, true)
}

export function GetAuth(path: string|RegExp) {
  return Method('get', path, true)
}

export function PostAuth(path: string|RegExp) {
  return Method('post', path, true)
}

export function PutAuth(path: string|RegExp) {
  return Method('put', path, true)
}

export function DeleteAuth(path: string|RegExp) {
  return Method('del', path, true)
}

export function HeadAuth(path: string|RegExp) {
  return Method('head', path, true)
}

export function PatchAuth(path: string|RegExp) {
  return Method('patch', path, true)
}
