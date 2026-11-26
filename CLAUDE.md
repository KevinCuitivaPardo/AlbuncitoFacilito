# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Producto

AlbuncitoFacilito es una aplicación para coleccionar álbumes de Cody y llevar el control de los stickers de cada álbum: cuáles tengo, cuáles me faltan y cuáles están repetidos.

El producto tiene 2 partes, y cada una tiene su propio `CLAUDE.md`:

- **Frontend**: `apps/albuncito-facilito-app`, la interfaz que usa el coleccionista.
- **Backend (API)**: `services/albuncito-facilito-api`, que guarda los álbumes, los stickers y la colección de cada usuario.

El frontend consume la API: no accede a los datos directamente.

### Detalles de la API (`services/albuncito-facilito-api`)

- Paquete `albuncito-facilito-api`: NestJS 12 sobre Express, TypeScript en ESM (imports relativos con extensión `.js`).
- Tests con Vitest (unitarios `src/**/*.spec.ts`, e2e en `test/*.e2e-spec.ts` con supertest) y lint con oxlint.
- Escucha en el puerto 3001 (variable `PORT`). Endpoints: `GET /` (ejemplo) y los de autenticación (`/auth/*`, ver abajo).
- Base de datos: SQLite nativo de Node (`node:sqlite`), archivo `data/albuncito.db` dentro de la API (ignorado por git). Sin ORM.
- Dependencias de auth: `@nestjs/jwt` y `zod` (validación). Sin Prettier ni telemetría.
- Comandos propios (`pnpm dev`, `pnpm test`, `pnpm test:e2e`, `pnpm lint`) en su `CLAUDE.md`.

### Autenticación (signup/login con email y contraseña)

- La API expone `POST /auth/signup` (`name`, `email`, `password`; 201 con `accessToken` y `user`; 409 si el email existe), `POST /auth/login` (`email`, `password`; 200; 401 "Credenciales inválidas") y `GET /auth/me` (requiere `Authorization: Bearer <JWT>`).
- Las contraseñas se guardan con hash scrypt (`scrypt$N$r$p$sal$hash`), nunca en texto plano. El JWT dura 7 días y se firma con `JWT_SECRET`.
- Cada usuario tiene un `slug` único generado a partir de su `name` (`Ana Pérez` → `ana-perez`, `ana-perez-2` si ya existe). Los slugs `login`, `signup`, `logout` y `api` están reservados.
- El frontend tiene `/signup`, `/login` y el dashboard en `/[slug]`. Los Server Actions llaman a la API, guardan el JWT en la cookie `session` (httpOnly) y redirigen a `/<slug>`.
- Variables de entorno: API en `services/albuncito-facilito-api/.env` (`JWT_SECRET` obligatorio; copia `.env.example`); frontend usa `API_URL` (opcional, por defecto `http://localhost:3001`). Los `.env` no se versionan.
- Si cambias los endpoints de `/auth/*` o la forma de `user`, actualiza también `apps/albuncito-facilito-app/app/lib/api.ts`.

## Estructura del monorepo

- `apps/*`: aplicaciones (frontend). Workspace definido en `pnpm-workspace.yaml`.
- `services/*`: APIs (backend).
- `turbo.json`: tareas `build`, `dev`, `test` y `lint` que Turborepo ejecuta en todos los proyectos.
- Usa siempre `pnpm` (la versión está fijada en `packageManager`); no uses npm ni yarn.

## Comandos (desde la raíz)

- Instalar dependencias: `pnpm install`
- Antes del primer `pnpm dev`: crea `services/albuncito-facilito-api/.env` a partir de `.env.example` y define `JWT_SECRET` (sin él la API no arranca).
- Build: `pnpm build`
- Dev: `pnpm dev` (frontend en http://localhost:3000, API en http://localhost:3001)
- Test: `pnpm test`
- Lint: `pnpm lint`
- Un solo proyecto: `pnpm turbo run <tarea> --filter=albuncito-facilito-app` (o `--filter=albuncito-facilito-api`)

## Reglas generales

- Responde siempre en español.
- Stack: monorepo con Turborepo 2.11 y pnpm 12 (TypeScript en todo el repo). Frontend con Next.js 16 y backend con NestJS 12.
- Nombres de variables en inglés y comentarios en español.
- Antes de hacer un commit, corre los tests si existen.

## Development

Cuando necesites instalar, actualizar o escribir código con cualquier librería o framework (Turborepo, pnpm, Next.js, NestJS, etc.), consulta primero la documentación actual con el MCP de context7.

## Git

- Solo hago commits cuando el usuario lo pida.
- Ni los commits ni los PR llevan atribución a Claude: sin `Co-Authored-By: Claude` ni "Generated with Claude Code".
