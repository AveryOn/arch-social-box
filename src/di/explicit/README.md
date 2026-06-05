# Описание модуля Явного Внедрени Зависимостей

### Описание файлов:
 - di.explicit.container.ts     — механизм хранения/получения зависимостей
 - di.explicit.token.ts         — DI-токены
 - di.explicit.provider.ts      — типы provider-описаний
 - di.explicit.module.ts        — сборка зависимостей проекта

---

### Порядок зависимостей в `inject`

В explicit DI контейнер не определяет зависимости автоматически и не читает имена аргументов конструктора.

Порядок токенов в `inject` должен строго совпадать с порядком аргументов конструктора.

```ts
constructor(
  private readonly logger: Logger,
  private readonly userRepo: UserRepoPort
) {}
```

```ts
inject: [
  ExplicitToken.LOGGER,
  ExplicitToken.USER_REPO_PORT
]
```

Правило:
```ts
 inject[0] → constructor argument 0
 inject[1] → constructor argument 1
 inject[2] → constructor argument 2
```

Если порядок нарушен, контейнер передаст зависимости не в те аргументы, и объект будет создан некорректно.

---

### Типы provider-ов: `useClass`, `useValue`, `useFactory`

DI-контейнер регистрирует зависимости через provider. Provider описывает, что нужно создать или вернуть, когда кто-то вызовет `resolve(token)`.

---

## `useClass`

`useClass` используется, когда контейнер должен сам создать экземпляр класса через `new`.

```ts
{
  token: ExplicitToken.USER_REPO_PORT,
  useClass: UserRepoAdapter
}
```

При вызове:

```ts
container.resolve(ExplicitToken.USER_REPO_PORT)
```

контейнер выполнит примерно это:

```ts
const instance = new UserRepoAdapter()
```

Если у класса есть зависимости, они указываются через `inject`.

```ts
{
  token: ExplicitToken.USER_CREATE_USE_CASE,
  useClass: CreateUserUseCase,
  inject: [ExplicitToken.USER_REPO_PORT]
}
```

При `resolve` контейнер выполнит примерно это:

```ts
const repo = container.resolve(ExplicitToken.USER_REPO_PORT)

const instance = new CreateUserUseCase(repo)
```

`useClass` подходит для сервисов, use-case-ов, handler-ов, adapter-ов и других классов приложения.

---

## `useValue`

`useValue` используется, когда нужно зарегистрировать уже готовое значение или уже созданный объект.

```ts
const logger = Logger.create()

container.register({
  token: ExplicitToken.LOGGER,
  useValue: logger
})
```

При вызове:

```ts
container.resolve(ExplicitToken.LOGGER)
```

контейнер не создает новый объект, а просто возвращает готовое значение:

```ts
return logger
```

`useValue` подходит для конфигов, готовых singleton-объектов, env-значений, logger instance, database connection instance.

---

## `useFactory`

`useFactory` используется, когда объект нужно создать вручную через функцию.

```ts
{
  token: ExplicitToken.USER_CREATE_USE_CASE,
  useFactory: (repo: UserRepoPort, logger: Logger) => {
    return new CreateUserUseCase(
      repo,
      logger.scope('CreateUserUseCase')
    )
  },
  inject: [
    ExplicitToken.USER_REPO_PORT,
    ExplicitToken.LOGGER
  ]
}
```

При `resolve` контейнер выполнит примерно это:

```ts
const repo = container.resolve(ExplicitToken.USER_REPO_PORT)
const logger = container.resolve(ExplicitToken.LOGGER)

const instance = provider.useFactory(repo, logger)
```

`useFactory` подходит, когда простого `new Class(...)` недостаточно.

Например:

* нужно создать scoped logger;
* нужно передать computed config;
* нужно вызвать дополнительную логику при создании;
* нужно создать объект не напрямую через class;
* нужно выбрать реализацию по условию.

---

## Как `resolve` работает с provider-ами

При вызове:

```ts
container.resolve(token)
```

контейнер делает следующее:

1. Проверяет, есть ли уже созданный instance в cache.
2. Если есть — возвращает его.
3. Если нет — ищет provider по token.
4. Определяет тип provider-а.
5. Создает или возвращает значение.
6. Сохраняет instance в cache.
7. Возвращает готовую зависимость.

Логика:

```ts
if ('useValue' in provider) {
  return provider.useValue
}

if ('useClass' in provider) {
  const deps = provider.inject?.map(token => this.resolve(token)) ?? []
  return new provider.useClass(...deps)
}

if ('useFactory' in provider) {
  const deps = provider.inject?.map(token => this.resolve(token)) ?? []
  return provider.useFactory(...deps)
}
```

---

## Кратко

`useClass` — контейнер сам создает класс через `new`.

`useValue` — контейнер возвращает готовое значение.

`useFactory` — контейнер вызывает функцию, а функция сама создает объект.

`inject` используется в `useClass` и `useFactory`, чтобы контейнер понял, какие зависимости нужно сначала получить через `resolve`.
