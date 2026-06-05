import type {
  ClassConstructor,
  ExplicitProvider
} from '~/di/explicit/di.explicit.provider'
import type { ExplicitToken } from '~/di/explicit/di.explicit.token'

export class ExplicitContainer {
  private readonly providers = new Map<ExplicitToken, ExplicitProvider>()
  private readonly instances = new Map<ExplicitToken, unknown>()

  register(provider: ExplicitProvider): void
  register(provider: ExplicitProvider[]): void
  register(oneProviderOrMany: ExplicitProvider | ExplicitProvider[]): void {
    const providers = Array.isArray(oneProviderOrMany)
      ? oneProviderOrMany
      : [oneProviderOrMany]

    for (const provider of providers) {
      this.providers.set(provider.token, provider)
    }
  }

  resolve<T>(token: ExplicitToken): T
  resolve<T>(token: ExplicitToken[]): T[]
  resolve<T>(token: ExplicitToken | ExplicitToken[]): T | T[] {
    const isArray = Array.isArray(token)
    const tokens = isArray ? token : [token]
    const instances: T[] = []
    for (const t of tokens) {
      if (this.instances.has(t)) {
        return this.instances.get(t) as T
      }

      const provider = this.providers.get(t)

      if (!provider) {
        throw new Error(`DI provider not found: ${String(t)}`)
      }

      const instance = this.createInstance(provider)

      this.instances.set(t, instance)

      instances.push(instance as T)
    }
    return isArray ? instances : instances[0]
  }

  private createInstance(provider: ExplicitProvider): unknown {
    if ('useValue' in provider) {
      return provider.useValue
    }

    if ('useFactory' in provider) {
      const dependencies = this.resolve(provider.inject ?? [])

      return provider.useFactory(...dependencies)
    }

    if ('useClass' in provider) {
      const dependencies = this.resolve(provider.inject ?? [])

      return this.instantiate(provider.useClass, dependencies)
    }

    throw new Error('Invalid DI provider')
  }

  private instantiate<T>(
    ClassRef: ClassConstructor<T>,
    dependencies: unknown[]
  ): T {
    return new ClassRef(...dependencies)
  }
}
