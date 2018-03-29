import test from 'ava'
import app from '../src/app'
import {setupSocket} from '../src/socket'
import * as Socket from 'socket.io-client'

const server = app.listen(8004)
setupSocket(server)

test.after(t => {
  server.close()
})

test.cb('ws > connecting', t => {
  const socket = Socket('http://localhost:8004', {
    query: {token: 'foobar'},
  })
  let connected = false
  socket.on('connect', () => {
    connected = true
  })
  socket.on('message', data => {
    t.true(connected)
    t.is(data, 'I am a Socket Server.')
    socket.close()
    t.end()
  })
  socket.on('error', err => {
    t.fail()
  })
})

test.cb('ws > auth error', t => {
  const socket = Socket('http://localhost:8004', {
    query: {token: 'boo'},
  })
  let connected = false
  socket.on('connect', () => {
    connected = true
  })
  socket.on('error', err => {
    t.false(connected)
    t.is(err, 'Unauthorized')
    t.end()
  })
})

test.cb('ws > echo', t => {
  const socket = Socket('http://localhost:8004', {
    query: {token: 'foobar'},
  })
  socket.on('connect', () => {
    socket.emit(':echo', 'hello')
  })
  socket.on(':echo', data => {
    t.is(data, 'hello')
    t.end()
  })
})

test.cb('ws > trigger error', t => {
  const socket = Socket('http://localhost:8004', {
    query: {token: 'foobar'},
  })
  socket.on(':error', err => {
    t.is(err.message, 'trigger error')
    t.end()
  })
  socket.emit(':trigger-error', 'Error!!')
})
