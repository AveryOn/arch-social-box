# Request log context через `AsyncLocalStorage`

`logContext` используется для хранения технического контекста текущего HTTP-запроса.

Главная задача — автоматически добавлять `requestId` (и `tracId` при необходимости) в каждый лог, который был создан во время обработки конкретного запроса.

---

## Проблема

Без `logContext` `requestId` пришлось бы передавать вручную через все слои приложения:

```ts
handler -> useCase -> service -> repository -> logger
```

Это плохо, потому что бизнес-код начинает таскать техническую информацию, которая не относится к бизнес-логике.

Пример плохого подхода:

```ts
await createUserUseCase.execute(dto, requestId)
```

Потом дальше:

```ts
await userRepo.create(user, requestId)
```

Так делать не нужно.

---

## Решение

Для хранения `requestId` используется `AsyncLocalStorage` из Node.js.

```ts
import { AsyncLocalStorage } from 'node:async_hooks'

export interface LogContext {
  requestId: string
}

export const logContext = new AsyncLocalStorage<LogContext>()
```

`AsyncLocalStorage` позволяет создать отдельное хранилище данных для конкретной async-цепочки.

В контексте Express это означает:

```txt
один HTTP request = один async context = один requestId
```

---

## Подключение middleware

В Express middleware создается новый `requestId` для каждого входящего запроса.

```ts
this.server.use((_req, _res, next) => {
  logContext.run({ requestId: crypto.randomUUID() }, () => {
    next()
  })
})
```

Что здесь происходит:

```txt
1. Приходит HTTP request.
2. Middleware создает новый requestId.
3. logContext.run(...) открывает async-контекст.
4. Внутри этого контекста вызывается next().
5. Express передает управление следующим middleware / route handler.
6. Весь дальнейший код запроса работает внутри этого async-контекста.
```

---

## Как работает `run`

Метод `run` принимает два аргумента:

```ts
logContext.run(store, callback)
```

Где:

```ts
store = { requestId: crypto.randomUUID() }
callback = () => next()
```

То есть:

```ts
logContext.run({ requestId }, () => {
  next()
})
```

означает:

```txt
Выполни next() внутри async-контекста, в котором доступен requestId.
```

---

## Как logger получает `requestId`

Внутри логгера можно получить текущий контекст через `getStore()`.

```ts
const context = logContext.getStore()
```

Если логгер вызван во время обработки HTTP-запроса, `context` будет содержать `requestId`.

```ts
const event = {
  level,
  message,
  requestId: context?.requestId
}
```

Использование логгера остается простым:

```ts
logger.info('Creating user')
```

`requestId` не передается вручную.

Логгер сам достает его из `logContext`.

---

## Пример полного потока

Middleware:

```ts
this.server.use((_req, _res, next) => {
  logContext.run({ requestId: crypto.randomUUID() }, () => {
    next()
  })
})
```

Handler:

```ts
export class UserHandler {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly logger: Logger
  ) {}

  create = async (req: Request, res: Response): Promise<void> => {
    this.logger.info('Create user request received')

    const user = await this.createUserUseCase.execute(req.body)

    this.logger.info('Create user request finished')

    res.json(user)
  }
}
```

Use-case:

```ts
export class CreateUserUseCase {
  constructor(
    private readonly userRepo: UserRepoPort,
    private readonly logger: Logger
  ) {}

  async execute(dto: CreateUserDto): Promise<UserEntity> {
    this.logger.info('Creating user in use-case')

    const user = UserEntity.create(dto)

    await this.userRepo.create(user)

    this.logger.info('User created')

    return user
  }
}
```

Logger:

```ts
export class Logger {
  info(message: string): void {
    const context = logContext.getStore()

    const event = {
      level: 'info',
      message,
      requestId: context?.requestId,
      timestamp: new Date().toISOString()
    }

    this.write(event)
  }
}
```

Все эти логи будут иметь один и тот же `requestId`, потому что они были вызваны внутри одной async-цепочки запроса.

---

## Пример результата

```txt
[INFO] [request:550e8400-e29b-41d4-a716-446655440000] Create user request received
[INFO] [request:550e8400-e29b-41d4-a716-446655440000] Creating user in use-case
[INFO] [request:550e8400-e29b-41d4-a716-446655440000] User created
[INFO] [request:550e8400-e29b-41d4-a716-446655440000] Create user request finished
```

Так можно увидеть все логи, относящиеся к одному HTTP-запросу.

---

## Почему `requestId` не смешивается между запросами

Каждый входящий HTTP-запрос проходит через middleware отдельно.

Для каждого запроса вызывается:

```ts
logContext.run({ requestId: crypto.randomUUID() }, () => {
  next()
})
```

То есть каждый запрос получает собственный async-контекст.

Пример:

```txt
Request A -> requestId: aaa-111
Request B -> requestId: bbb-222
```

Даже если запросы выполняются параллельно, `AsyncLocalStorage` сохраняет отдельный контекст для каждой async-цепочки.

---

## Где это работает

`logContext` сохраняется через обычные async-операции Node.js:

```ts
await useCase.execute()
await repo.create()
await database.query()
await fetch(...)
setTimeout(...)
Promise
```

То есть в стандартной обработке HTTP-запроса контекст обычно сохраняется корректно.

---

## Где контекст может потеряться

`AsyncLocalStorage` не передает контекст автоматически в полностью отдельные процессы или внешние системы.

Контекст не будет автоматически доступен в:

```txt
child_process
worker_threads
queue jobs
cron jobs
отдельных Node.js процессах
внешних сервисах
```

Если лог отправляется в дочерний процесс, `requestId` нужно передать как часть `LogEvent`.

Правильно:

```ts
const context = logContext.getStore()

const event = {
  message,
  level,
  requestId: context?.requestId
}

loggerWorker.send(event)
```

Дочерний процесс не должен сам читать `logContext`. Он получает уже готовый `requestId` внутри события.

---

## Важное правило

`logContext` должен использоваться только на уровне технической инфраструктуры.

Бизнес-код не должен напрямую зависеть от `AsyncLocalStorage`.

Правильно:

```ts
this.logger.info('User created')
```

Неправильно:

```ts
const context = logContext.getStore()
```

внутри use-case.

Use-case должен работать с `Logger`, а не с `logContext`.

---

## Итоговая схема

```txt
HTTP request
  ↓
Express middleware
  ↓
logContext.run({ requestId }, () => next())
  ↓
Handler
  ↓
UseCase
  ↓
Repository
  ↓
Logger
  ↓
logContext.getStore()
  ↓
LogEvent с requestId
```

Главное:

```txt
run() создает async-контекст
getStore() читает текущий async-контекст
logger автоматически добавляет requestId в лог
бизнес-код не передает requestId руками
```
