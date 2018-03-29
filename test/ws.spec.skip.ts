// import test, {
//   TestContext,
//   Context,
// } from 'ava'
// import app from '../src/app'
// import * as Websocket from 'ws'
// import {
//   sign,
// } from 'jsonwebtoken'
// import cf from '../src/config'

// const server = app.listen(8004)

// test.after(t => {
//   server.close()
// })

// test.cb('ws > connecting', t => {
//   const ws = new Websocket('ws://localhost:8004/v1/ws')
//   let opened = false
//   ws.on('open', () => {
//     opened = true
//   })
//   ws.on('message', data => {
//     t.true(opened)
//     t.is(data, 'I am a Websocket server.')
//     t.end()
//   })
//   ws.on('error', () => {
//     t.fail()
//   })
// })

// test.cb('ws > echo', t => {
//   const ws = new Websocket('ws://localhost:8004/v1/ws/echo')
//   ws.on('open', () => {
//     ws.send('Hello World!!')
//   })
//   ws.on('message', data => {
//     t.is(data, 'Hello World!!')
//     t.end()
//   })
// })

// test.cb('ws > json', t => {
//   const ws = new Websocket('ws://localhost:8004/v1/ws/json')
//   ws.on('open', () => {
//     ws.send(JSON.stringify({
//       message: 'hello'
//     }))
//     ws.send(JSON.stringify({
//       message: 'foobar'
//     }))
//     // ws.send('zzz')
//   })
//   ws.on('message', msg => {
//     const data = JSON.parse(msg.toString())
//     if(data.message === 'hello') {
//       t.is(data.data, 'I am glad to see you.')
//     }
//     if(data.message === undefined) {
//       t.is(data.data, null)
//       t.is(data.error.message, 'I am not understanding your message.')
//       t.end()
//     }
//   })
// })

// // test.cb('ws > cannot decoded', t => {
// //   const ws = new Websocket('ws://localhost:8004/v1/ws/auth/naki', {
// //     headers: {
// //       'x-access-token': 'sdkfjslfkjasdlfkj',
// //     },
// //   })
// //   ws.on('open', () => {
// //     t.end()
// //   })
// //   ws.on('message', msg => {
// //     console.log('msg: ', msg)
// //   })
// // })

// // test.cb('ws > auth', t => {
// //   const ws = new Websocket('ws://localhost:8004/v1/ws/auth/naki', {
// //     headers: {
// //       'x-access-token': sign({
// //         user: 'boofar',
// //         permissions: ['read'],
// //       }, cf.jwt.secret, cf.jwt.options),
// //     },
// //   })
// //   ws.on('open', () => {
// //     ws.send(JSON.stringify({
// //       message: 'hello'
// //     }))
// //     ws.send(JSON.stringify({
// //       message: 'foobar'
// //     }))
// //     ws.send('zzz')
// //   })
// //   ws.on('message', msg => {
// //     const data = JSON.parse(msg.toString())
// //     if(data.message === 'hello') {
// //       t.is(data.data, 'I am glad to see you.')
// //     }
// //     if(data.message === 'foobar') {
// //       t.is(data.data, null)
// //       t.is(data.error, 'I am not understanding your message.')
// //     }
// //     if(data.message === 'none') {
// //       t.is(data.data, null)
// //       t.is(data.error, 'Unexpected token z in JSON at position 0')
// //       t.end()
// //     }
// //   })
// // })
