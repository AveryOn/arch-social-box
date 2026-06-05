# Правила именования файлов в проекте

Не стоит делать слишком ситуативные имена как например:
 - create-express-app.ts
 - create-user.use-case.ts
 - create-hono-app.ts
 - setup-routes.ts
 - ... и так далее...

> Необходимо строго придерживаться одних правил наименования во всем проекте, для того чтобы не размазывать неявные реализации и различные части проекта по всей файловой структуре.

Есть базовый список наименований, который описывает общую природу компонентов системы:
 - `process`        — запускаемый процесс приложения
 - `server`         — серверная реализация транспорта
 - `handler`        — обработчик входящего запроса/команды
 - `contract`       — внешний или внутренний контракт
 - `abstraction`    — порт/интерфейс/токен
 - `implementation` — конкретная реализация
 - `module`         — бизнес-модуль или технический модуль
 - `provider`       — DI-регистрация зависимости

> не важно, будет то Express сервер или RabbitMQ процесс, всё поддается общей природе компонентов

### И таким образом, наименования файлов можно представлять так:
 - `*.process.ts`
 - `*.server.ts`
 - `*.handler.ts`
 - `*.contract.ts`
 - `*.port.ts`
 - `*.adapter.ts`
 - `*.provider.ts`
 - `*.module.ts`
 - `*.entity.ts`
 - `*.service.ts`
 - `*.use-case.ts`

---

### Наименование происходит по принципу:

- `<domain-or-tech-name>.<component-role>.ts`

---

### Пример общей схемы:

 ```plain
    src/
    ├── processes/
    │   └── main.process.ts
    ├── transports/
    │   ├── express/
    │   │   ├── express.server.ts
    │   │   ├── express.module.ts
    │   │   ├── handlers/
    │   │   │   └── user.handler.ts
    │   │   └── routes/
    │   │       └── user.routes.ts
    │   ├── hono/
    │   │   ├── hono.server.ts
    │   │   ├── hono.module.ts
    │   │   ├── handlers/
    │   │   │   └── user.handler.ts
    │   │   └── routes/
    │   │       └── user.routes.ts
    │   └── grpc/
    │       ├── grpc.server.ts
    │       ├── grpc.module.ts
    │       ├── handlers/
    │       │   └── user.handler.ts
    │       └── contracts/
    │           └── user.contract.ts
    ├── domain/
    │   └── users/
    │       ├── user.module.ts
    │       ├── entities/
    │       │   └── user.entity.ts
    │       ├── use-cases/
    │       │   └── create-user.use-case.ts
    │       └── ports/
    │           └── user-repository.port.ts
    ├── database/
    │   ├── drizzle/
    │   │   ├── drizzle.module.ts
    │   │   ├── drizzle.client.ts
    │   │   └── repositories/
    │   │       └── user-repository.adapter.ts
    │   └── prisma/
    │       ├── prisma.module.ts
    │       ├── prisma.client.ts
    │       └── repositories/
    │           └── user-repository.adapter.ts
    ├── di/
    │   ├── explicit/
    │   │   ├── explicit.container.ts
    │   │   ├── explicit.provider.ts
    │   │   └── explicit.module.ts
    │   └── decorators/
    │       ├── decorators.container.ts
    │       ├── decorators.provider.ts
    │       └── decorators.module.ts
    └── shared/
        └── errors/
            └── app.error.ts
 ```

---

### Файл отвечает на 2 вопроса:
 ```plain
  что это?                  user / express / drizzle / explicit
  Какая у него роль?        entity / server / adapter / provider / module
 ```

---

### Формула:

 - Регулярный сценарий:
   ```plain
    <subject>.<role>.ts
   ```
 - Use Case сценарий:
   ```plain
    <action>-<subject>.use-case.ts
   ```