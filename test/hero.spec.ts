import test from 'ava'
import app from '../src/app'
import { Server } from 'http'
import axios, {AxiosError} from 'axios'


let server: Server
const req = axios.create({baseURL: 'http://localhost:8003/v1'})

test.before(t => {
  app.on('error', err => {
    console.log(err.message)
  })
  server = app.listen(8003)
})

test.after(t => {
  server.close()
})

test('hero > responds with JSON array', async t => {
  try {
    const res = await req.get('/heroes')
    const data = res.data.data
    t.true(Array.isArray(data))
    t.is(data.length, 5)
  } catch(err) {
    t.fail(err.message)
  }
})

test('hero > responds with single JSON object', async t => {
  try {
    const res = await req.get('/heroes/1')
    const hero = res.data.data
    t.truthy(hero)
    t.is(hero.name, 'Luke Cage')
  } catch(err) {
    t.fail(err.message)
  }
})