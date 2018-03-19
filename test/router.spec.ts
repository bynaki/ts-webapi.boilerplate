import test from 'ava'
import app from '../src/app'
import axios, { AxiosInstance, AxiosError } from 'axios'
import * as http from 'http'


const server = http.createServer(app.callback())
const req = axios.create({baseURL: 'http://localhost:8110/v1'})

test.before('start server', async t => {
  server.listen(8110)
})

test.after('end server', t => {
  server.close()
})


test('router > must be ordered', async t => {
  const res = await req.get('/router/order')
  const data: number[] = res.data
  t.true(data.length > 0)
  data.forEach((val, idx) => {
    t.is(val, idx)
  })
})

test('router > right params', async t => {
  const res = await req.get('/router/foo/bar')
  t.deepEqual(res.data, {to: 'foo', path: 'bar'})
})

test('router > the user is good guy', async t => {
  const res = await req.get('/router/user/goodguy')
  t.is(res.data, 'Good Guy!!')
})

test('router > Unauthorized Error', async t => {
  try {
    const res = await req.get('/router/user/badguy')
  } catch(e) {
    const err: AxiosError = e
    t.is(err.response.data.errorMessage, 'Unauthorized: Bad Guy!!')
  }
})
