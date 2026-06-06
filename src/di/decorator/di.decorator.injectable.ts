import { ClassDecorator } from "~/di/decorator";

const INJECTABLE_METADATA_KEY = Symbol('di:injectable')

export function Injectable(): ClassDecorator {

}

