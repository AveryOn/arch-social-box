import 'reflect-metadata'
import type { DecoratorToken, DecoratorProvider, InjectMetadata, ValueProvider, ClassDecorator, Function, FactoryProvider, ClassProvider } from "~/di/decorator";


export const INJECT_METADATA_KEY = Symbol('di:inject')
const INJECTABLE_METADATA_KEY = Symbol('di:injectable')

export function Injectable(): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, target)
  }
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

export class DecoratorContainer {
  private readonly providers = new Map<DecoratorToken, DecoratorProvider>()
  private readonly instances = new Map<DecoratorToken, unknown>()

  register(provider: DecoratorProvider): void
  register(provider: DecoratorProvider[]): void
  register(provider: DecoratorProvider | DecoratorProvider[]): void {
    if(Array.isArray(provider)) {
      for (const p of provider) {
        this.providers.set(p.token, p)
      }
      return void 1
    }
    this.providers.set(provider.token, provider);
    return void 1
  }

  resolve<T = unknown>(token: DecoratorToken): T {
    const provider = this.providers.get(token)

    if(!provider) {
      throw new Error(`provider is not registered by Token=${token}`)
    }


    const instance = this.instances.get(token)

    if(!instance) {
      return this.createInstance(provider) as T
    }

    return instance as T
  }

  private createInstance(provider: DecoratorProvider): unknown {
    if(this.isValueProvider(provider)) {
      return provider.useValue
    }

    if(this.isFactoryProvider(provider)) {
      const deps = provider.inject?.map(token => this.resolve(token)) ?? []

      return provider.useFactory(...deps)
    }

    if(this.isClassProvider(provider)) {
      const targetClass = provider.useClass

      if(this.isInjectable(targetClass)) {
        //
      }

      Reflect.getMetadata(INJECT_METADATA_KEY, this)
    }

    if(this)
    return provider
  }

  private isClassProvider(provider: ClassProvider): provider is ClassProvider {
    return 'useClass' in provider
  }

  private isValueProvider(provider: DecoratorProvider): provider is ValueProvider {
    return 'useValue' in provider
  }

  private isFactoryProvider(provider: DecoratorProvider): provider is FactoryProvider {
    return 'useFactory' in provider
  }


  private getInjectMetadata(target: Function): InjectMetadata[] {
    const metadata =
      Reflect.getMetadata(INJECT_METADATA_KEY, target) as
        | InjectMetadata[]
        | undefined

    return metadata ?? []
  }

  private isInjectable(target: Function): boolean {
    return Reflect.getMetadata(INJECTABLE_METADATA_KEY, target) === true
  }

}
