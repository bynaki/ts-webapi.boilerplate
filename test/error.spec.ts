import test from 'ava'
import app from '../src/app'
import { Server } from 'http'
import axios, {AxiosError} from 'axios'


let server: Server
const req = axios.create({baseURL: 'http://localhost:8002/v1'})

test.before(t => {
  app.on('error', err => {
    console.log(err.message)
  })
  server = app.listen(8002)
})

test.after(t => {
  server.close()
})

test('error > not found error', async t => {
  const err: AxiosError = await t.throws(req.get('/error/notfound'))
  t.is(err.response.status, 404)
  t.is(err.response.data.error.message, 'Not Found: requested GET /v1/error/notfound')
})

test('error > internal error', async t => {
  const err: AxiosError = await t.throws(req.get('/error/internal'))
  t.is(err.response.status, 500)
  t.is(err.response.data.error.message, 'Internal Error!!')
})

test('error > bad request error', async t => {
  const err: AxiosError = await t.throws(req.get('/error/badrequest'))
  t.is(err.response.status, 400)
  t.is(err.response.data.error.message, 'Bad Request: Bad Request Error!!')
})

test('error > unauthorized error', async t => {
  const err: AxiosError = await t.throws(req.get('/error/unauthorized'))
  t.is(err.response.status, 401)
  t.is(err.response.data.error.message, 'Unauthorized: Unauthorized Error!!')
})