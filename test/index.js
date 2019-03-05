global.Promise = require('bluebird')

/* looping
const interval = setInterval(() => {
	console.log(new Date())
}, 500)
//*/

//* raven
const Raven = require('raven')
Raven.config('https://631b31cb1c7048beb3de2fbd6a6e8fcb@sentry.io/1265715').install(() => {})
//*/

process.on('unhandledRejection', (err) => {
	throw err
})

process.on('uncaughtException', async (err) => {
	console.log('Error handler')

	await Promise.delay(2000)

	// clearInterval(interval)

	console.error(err.stack)
})

/* throw error
throw new Error(`Hello World! ${(new Date()).getTime()}`)
//*/

//* async throw error
;(async () => {
	throw new Error(`Hello World! ${(new Date()).getTime()}`)
})()
//*/
