import { DecoratorContainer } from '~/di/decorator'
import { ExplicitContainer } from '~/di/explicit'
import { DiContainerPort } from '~/di/ports/di.container.port'
import { DiMode, DiProvider } from '~/di/types'
import { Logger } from '~/shared/logger'

export class DiModule {
  private container: DiContainerPort

  bootstrap(deps: DiProvider[]): DiContainerPort {
    this.container.register(deps)
    return this.container
  }

  constructor(mode: keyof typeof DiMode) {
    const modeIsValide = [DiMode.decorator, DiMode.explicit].includes(
      mode as DiMode
    )
    if (!modeIsValide) throw Logger.create().error('Mode is not valide')

    this.container = new {
      [DiMode.decorator]: DecoratorContainer,
      [DiMode.explicit]: ExplicitContainer
    }[mode]()
  }
}
