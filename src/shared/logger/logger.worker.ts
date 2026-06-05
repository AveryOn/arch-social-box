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
    ? chalk.hex('#b5ffdb')(`[request:${event.requestId}]`)
    : ''

  return [
    chalk.hex('#c1f2ff')(event.timestamp),
    level,
    scope,
    requestId,
    chalk.hex('#ffffff')(event.message)
  ]
    .filter(Boolean)
    .join(' ')
}

function colorLevel(level: LogEvent['level']): string {
  switch (level) {
    case 'debug':
      return chalk.hex('#ffddff').bold('[DEBUG]')
    case 'info':
      return chalk.hex('#81c2ff').bold('[INFO]')
    case 'warn':
      return chalk.hex('#ffb581').bold('[WARN]')
    case 'error':
      return chalk.hex('#e35b6b').bold('[ERROR]')
    case 'fatal':
      return chalk.bgHex('#f76971').hex('#000000').bold('[FATAL]')
  }
}
