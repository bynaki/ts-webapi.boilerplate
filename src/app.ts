/**
 * app.ts
 */

import * as fs from 'fs'
import {
  join,
} from 'path'
import {
  sayHello,
} from './lib/hello'


const content = fs.readFileSync(join(__dirname, 'assets/data.json'), 'utf8')
const json = JSON.parse(content)
console.log(`foo: ${json.foo}`)

console.log(sayHello('bynaki'))

export {sayHello}
