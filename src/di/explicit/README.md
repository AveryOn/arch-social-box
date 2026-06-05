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
