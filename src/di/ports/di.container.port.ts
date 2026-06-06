import { DiProvider, DiToken } from "~/di/types";

export abstract class DiContainerPort {

  abstract register(provider: DiProvider): void
  abstract register(provider: DiProvider[]): void
  abstract register(provider: DiProvider | DiProvider[]): void

  abstract resolve<T = unknown>(token: DiToken): T
}
