import { ClassDecorator, Function } from "~/di/decorator";

const INJECTABLE_METADATA_KEY = Symbol('di:injectable')

export function Injectable(): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, target)
  }
}

export function isInjectable(target: Function): boolean {
  return Reflect.getMetadata(INJECTABLE_METADATA_KEY, target) === true
}
