import { DiContainerPort } from '~/di/ports/di.container.port'
import { ClassConstructor, DiProvider, DiToken } from '~/di/types'

export class ExplicitContainer implements DiContainerPort {
  private readonly providers = new Map<DiToken, DiProvider>()
  private readonly instances = new Map<DiToken, unknown>()

  register(provider: DiProvider): void
  register(provider: DiProvider[]): void
  register(oneProviderOrMany: DiProvider | DiProvider[]): void {
    const providers = Array.isArray(oneProviderOrMany)
      ? oneProviderOrMany
      : [oneProviderOrMany]

    for (const provider of providers) {
      this.providers.set(provider.token, provider)
    }
  }

  resolve<T>(token: DiToken): T {
    if (this.instances.has(token)) {
      return this.instances.get(token) as T
    }

    const provider = this.providers.get(token)

    if (!provider) {
      throw new Error(`DI provider not found: ${String(token)}`)
    }

    const instance = this.createInstance(provider)

    this.instances.set(token, instance)

    return instance as T
  }

  private createInstance(provider: DiProvider): unknown {
    if ('useValue' in provider) {
      return provider.useValue
    }

    if ('useFactory' in provider) {
      const dependencies = this.resolveManyDeps(provider.inject)
      if (dependencies.length !== provider.useFactory.length) {
        throw new Error(
          `Invalid inject count for ${provider.token.toString()}`
        )
      }

      return provider.useFactory(...dependencies)
    }

    if ('useClass' in provider) {
      const dependencies = this.resolveManyDeps(provider.inject)

      if (dependencies.length !== provider.useClass.length) {
        throw new Error(
          `Invalid inject count for ${provider.useClass.name}`
        )
      }

      return this.instantiate(provider.useClass, dependencies)
    }

    throw new Error('Invalid DI provider')
  }

  private resolveManyDeps(tokens: DiToken[] = []): unknown[] {
    return tokens.map((token) => this.resolve(token))
  }

  private instantiate<T>(
    ClassRef: ClassConstructor<T>,
    dependencies: unknown[]
  ): T {
    return new ClassRef(...dependencies)
  }
}
