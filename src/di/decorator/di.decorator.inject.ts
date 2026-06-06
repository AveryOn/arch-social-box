import 'reflect-metadata'
import type { DecoratorToken } from './di.decorator.token'

const INJECT_METADATA_KEY = Symbol('di:inject')

export interface InjectMetadata {
  index: number
  token: DecoratorToken
}

export function Inject(token: DecoratorToken): ParameterDecorator {
  return (target, _propertyKey, parameterIndex) => {
    const existingMetadata =
      Reflect.getMetadata(INJECT_METADATA_KEY, target) as
        | InjectMetadata[]
        | undefined

    const metadata: InjectMetadata[] = existingMetadata ?? []

    metadata.push({
      index: parameterIndex,
      token
    })

    Reflect.defineMetadata(INJECT_METADATA_KEY, metadata, target)
  }
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function getInjectMetadata(target: Function): InjectMetadata[] {
  const metadata =
    Reflect.getMetadata(INJECT_METADATA_KEY, target) as
      | InjectMetadata[]
      | undefined

  return metadata ?? []
}
