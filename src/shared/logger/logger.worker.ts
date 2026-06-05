import chalk from 'chalk'
import type { LogEvent } from '~/shared/logger'

process.on('message', (event: LogEvent) => {
  const line = formatLog(event)

  console.log(line)

  if (event.details) {
    console.dir(event.details, { depth: null })
  }

  if (event.callstack) {
    console.log(event.callstack)
  }
})

function formatLog(event: LogEvent): string {
  const level = colorLevel(event.level)

  const scope = event.scope ? chalk.cyan(`[${event.scope}]`) : ''

  const requestId = event.requestId
    ? chalk.gray(`[request:${event.requestId}]`)
    : ''

  return [
    chalk.gray(event.timestamp),
    level,
    scope,
    requestId,
    event.message
  ]
    .filter(Boolean)
    .join(' ')
}

function colorLevel(level: LogEvent['level']): string {
  switch (level) {
    case 'debug':
      return chalk.gray('[DEBUG]')
    case 'info':
      return chalk.blue('[INFO]')
    case 'warn':
      return chalk.yellow('[WARN]')
    case 'error':
      return chalk.red('[ERROR]')
    case 'fatal':
      return chalk.bgRed.white('[FATAL]')
  }
}
