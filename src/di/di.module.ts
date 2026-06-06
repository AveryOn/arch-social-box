import { DecoratorContainer } from '~/di/decorator'
import { ExplicitContainer } from '~/di/explicit'
import { DiContainerPort } from '~/di/ports/di.container.port'
import { DiMode, DiProvider } from '~/di/types'
import { Logger } from '~/shared/logger'

export class DiDecoratorModule {
  private container: DiContainerPort

  constructor(mode: DiMode, deps: DiProvider[]) {
    const modeIsValide = [DiMode.decorator, DiMode.explicit].includes(mode)
    if (!modeIsValide) throw Logger.create().error('Mode is not valide')

    this.container = new {
      [DiMode.decorator]: DecoratorContainer,
      [DiMode.explicit]: ExplicitContainer
    }[mode]()

    this.container.register(deps)
  }
}
