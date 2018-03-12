/**
 * Test via AVA
 * https://github.com/avajs/ava
 */

import test from 'ava'
import {
  sayHello,
} from '../dist/lib/hello'


test('foo', t => {
  t.pass()
})

test('bar', async t => {
  const bar = Promise.resolve('bar')
  t.is(await bar, 'bar')
})

test('say hello', t => {
  t.is(sayHello('bynaki'), 'Hello, bynaki.')
})
