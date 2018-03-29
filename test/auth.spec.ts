import test from 'ava'
import app from '../src/app'
import { Server } from 'http'
import axios, { AxiosError } from 'axios'
import {
  sign,
} from 'jsonwebtoken'
import cf from '../src/config'


let server: Server
const req = axios.create({baseURL: 'http://localhost:8001/v1'})

test.before(t => {
  app.on('error', err => {
    console.log(err.message)
  })
  server = app.listen(8001)
})

test.after(t => {
  server.close()
})

test('auth > no token', async t => {
  const err: AxiosError = await t.throws(req.get('/auth/foobar'))
  t.is(err.response.status, 401)
  t.is(err.response.data.error.message, 'Unauthorized: You are not me.')
})

test('auth > different user', async t => {
  const err: AxiosError = await t.throws(req.get('/auth/foobar', {
    headers: {
      'x-access-token': sign({user: 'boofar'}, cf.jwt.secret, cf.jwt.options),
    },
  }))
  t.is(err.response.status, 401)
  t.is(err.response.data.error.message, 'Unauthorized: You are not me.')
})

test('auth > same user', async t => {
  try {
    const res = await req.get('/auth/foobar', {
      headers: {
        'x-access-token': sign({user: 'foobar'}, cf.jwt.secret, cf.jwt.options),
      },
    })
    t.is(res.data.data, 'Welcome, foobar')
  } catch(err) {
    t.fail(err.message)
  }
})

test('auth > Can not read', async t => {
  const err: AxiosError = await t.throws(req.get('/auth/foobar/do', {
    headers: {
      'x-access-token': sign({
        user: 'foobar',
      }, cf.jwt.secret, cf.jwt.options),
    },
  }))
  t.is(err.response.status, 401)
  t.is(err.response.data.error.message, 'Unauthorized: You have no authority.')
})

test('auth > can read', async t => {
  try {
    const res = await req.get('/auth/foobar/do', {
      headers: {
        'x-access-token': sign({
          user: 'foobar',
          permissions: ['read'],
        }, cf.jwt.secret, cf.jwt.options),
      },
    })
    t.is(res.data.data, 'You can read it.')
  } catch(err) {
    t.fail(err.message)
  }
})

test('auth > can not write', async t => {
  const err: AxiosError = await t.throws(req.post('/auth/foobar/do', null, {
    headers: {
      'x-access-token': sign({
        user: 'foobar',
        permissions: ['read'],
      }, cf.jwt.secret, cf.jwt.options),
    },
  }))
  t.is(err.response.status, 401)
  t.is(err.response.data.error.message, 'Unauthorized: You have no authority.')
})

test('auth > can write', async t => {
  try {
    const res = await req.post('/auth/foobar/do', null, {
      headers: {
        'x-access-token': sign({
          user: 'foobar',
          permissions: ['read', 'write'],
        }, cf.jwt.secret, cf.jwt.options),
      },
    })
    t.is(res.data.data, 'You can write it.')
  } catch(err) {
    t.fail(err.message)
  }
})
