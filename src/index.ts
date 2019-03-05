// Load npm modules.
import * as bluebird from 'bluebird'
import * as dotenv from 'dotenv'
import * as raven from 'raven'
import * as sourceMapSupport from 'source-map-support'

export const initialize = (callback: () => Promise<void>, timeout: number, sentryDsn?: string) => {
	// Add support for source-maps.
	sourceMapSupport.install()

	// Load bluebird as the global promise library.
	global.Promise = bluebird

	// Load environment variables.
	dotenv.config()

	// Setup the error reporter.
	if (sentryDsn !== undefined) {
		raven.config(sentryDsn).install()
	}

	// Termination signals.
	const terminationSignals: NodeJS.Signals[] = [
		// Add a listener for TERM signal .e.g. kill.
		'SIGTERM',
		// Add a listener for INT signal e.g. Ctrl-C.
		'SIGINT',
		'SIGHUP',
		'SIGBREAK',
	]

	// Define the shutdown process variable.
	let isShutdownInitiated = false
	let mainError: Error | null = null
	const capturedErrors: Error[] = []
	let timeoutTimer: null | NodeJS.Timer = null

	const terminateShutdown = (err?: Error) => {
		// If an error occurred, store it.
		if (err !== undefined) {
			capturedErrors.push(err)
		}

		// Clear the timeout timer if required.
		if (timeoutTimer !== null) {
			clearTimeout(timeoutTimer)
		}

		if (capturedErrors.length > 0) {
			console.error('[SHUTDOWN] The following errors had occurred during the graceful shutdown:') // tslint:disable-line:no-console
			capturedErrors.forEach((capturedError) => {
				console.error(capturedError) // tslint:disable-line:no-console
			})
		}

		// Disable all listeners that where previously set.
		for (const terminationSignal of terminationSignals) {
			process.removeAllListeners(terminationSignal)
		}
		process.removeAllListeners('message')
		process.removeAllListeners('uncaughtException')


		// Assure the process is properly exited.
		console.log('[SHUTDOWN] Exiting ...') // tslint:disable-line:no-console
		if ((mainError !== null) || (capturedErrors.length > 0)) {
			process.exitCode = -1
		}
		process.exit()
	}

	const initiateShutdown = (err?: Error) => {
		// If an error occurred, store it.
		if (err !== undefined) {
			if (isShutdownInitiated) {
				capturedErrors.push(err)
			} else {
				mainError = err
				console.error('[SHUTDOWN]', mainError) // tslint:disable-line:no-console
			}
		}

		// Ensure that only the first event is to be handled.
		if (isShutdownInitiated) {
			return
		}
		isShutdownInitiated = true

		// Add a timeout for the shutdown.
		timeoutTimer = setTimeout(() => {
			// Clear the timeout timer.
			timeoutTimer = null

			// Report that the shutdown timed out.
			console.log('[SHUTDOWN] The graceful shutdown has timed out ...') // tslint:disable-line:no-console

			// Set to exit with an error value.
			process.exitCode = -1

			// Finalize the shutdown process.
			terminateShutdown()
		}, timeout)

		// Call the callback with the proper finalization handler.
		callback()
			.then(() => {
				terminateShutdown()
			})
			.catch((error) => {
				terminateShutdown(error)
			})
	}

	// Add a listener for TERM signal .e.g. kill.
	for (const terminationSignal of terminationSignals) {
		process.on(terminationSignal, () => {
			initiateShutdown()
		})
	}

	// Add a listener for windows specific shutdown events.
	process.on('message', (message: string) => {
		if (message === 'shutdown') {
			initiateShutdown()
		}
	})

	// Add a listener for uncaught exceptions.
	process.on('uncaughtException', (err: Error) => {
		initiateShutdown(err)
	})

	// Makes the script crash on unhandled rejections instead of silently ignoring them.
	process.on('unhandledRejection', (err: Error) => {
		throw err
	})
}

export const ready = () => {
	if (process.send !== undefined) {
		process.send('ready')
	}
}
