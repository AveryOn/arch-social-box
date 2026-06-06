import 'reflect-metadata'
import {
  ClassDiProvider,
  DiProvider,
  DiToken,
  FactoryDiProvider,
  Function,
  InjectMetadata,
  ValueDiProvider
} from '~/di/types'

const INJECT_METADATA_KEY = Symbol('di:inject')
const INJECTABLE_METADATA_KEY = Symbol('di:injectable')

export class DecoratorContainer {
  private readonly providers = new Map<DiToken, DiProvider>()
  private readonly instances = new Map<DiToken, unknown>()

  register(provider: DiProvider): void
  register(provider: DiProvider[]): void
  register(provider: DiProvider | DiProvider[]): void {
    if (Array.isArray(provider)) {
      for (const p of provider) {
        this.providers.set(p.token, p)
      }
      return void 1
    }
    this.providers.set(provider.token, provider)
    return void 1
  }

  resolve<T = unknown>(token: DiToken): T {
    const provider = this.providers.get(token)

    if (!provider) {
      throw new Error(`provider is not registered by Token=${String(token)}`)
    }

    const instance = this.instances.get(token)

    if (!instance) {
      return this.createInstance(provider) as T
    }

    return instance as T
  }

  private createInstance(provider: DiProvider): unknown {
    if (this.isValueProvider(provider)) {
      return provider.useValue
    }

    if (this.isFactoryProvider(provider)) {
      const deps =
        provider.inject?.map((token) => this.resolve(token)) ?? []

      return provider.useFactory(...deps)
    }

    if (this.isClassProvider(provider)) {
      const TargetClass = provider.useClass

      if (this.isInjectable(TargetClass)) {
        throw new Error(`Class is not injectable: ${TargetClass.name}`)
      }

      const deps = this.getInjectMetadata(TargetClass)
        .sort((a, b) => a.index - b.index)
        .map((metadata) => this.resolve(metadata.token))

      return new TargetClass(...deps)
    }

    throw new Error('Invalid provider')
  }

  private isClassProvider(
    provider: ClassDiProvider
  ): provider is ClassDiProvider {
    return 'useClass' in provider
  }

  private isValueProvider(
    provider: DiProvider
  ): provider is ValueDiProvider {
    return 'useValue' in provider
  }

  private isFactoryProvider(
    provider: DiProvider
  ): provider is FactoryDiProvider {
    return 'useFactory' in provider
  }

  private getInjectMetadata(target: Function): InjectMetadata[] {
    const metadata = Reflect.getMetadata(INJECT_METADATA_KEY, target) as
      | InjectMetadata[]
      | undefined

    return metadata ?? []
  }

  private isInjectable(target: Function): boolean {
    return Reflect.getMetadata(INJECTABLE_METADATA_KEY, target) === true
  }
}

export function Injectable(): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, target)
  }
}

export function Inject(token: DiToken): ParameterDecorator {
  return (target, _propertyKey, parameterIndex) => {
    const existingMetadata = Reflect.getMetadata(
      INJECT_METADATA_KEY,
      target
    ) as InjectMetadata[] | undefined

    const metadata: InjectMetadata[] = existingMetadata ?? []

    metadata.push({
      index: parameterIndex,
      token
    })

    Reflect.defineMetadata(INJECT_METADATA_KEY, metadata, target)
  }
}
