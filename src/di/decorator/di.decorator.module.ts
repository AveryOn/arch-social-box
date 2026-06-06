import { DecoratorContainer } from '~/di/decorator'
import { DiProvider } from '~/di/types'

export class DiDecoratorModule {
  private container: DecoratorContainer

  constructor(deps: DiProvider[]) {
    this.container = new DecoratorContainer()
    this.container.register(deps)
  }
}
