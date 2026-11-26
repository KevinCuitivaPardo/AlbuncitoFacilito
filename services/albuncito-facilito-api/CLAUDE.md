# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué hace

Backend (API) de AlbuncitoFacilito: guarda los álbumes de Cody, sus stickers y la colección de cada usuario, y calcula qué stickers tiene, cuáles le faltan y cuáles están repetidos.

## Comunicación con el frontend

El frontend (`apps/albuncito-facilito-app`) consume esta API. Si cambias un endpoint o el formato de sus datos, revisa también el frontend, porque depende de ellos.

Las reglas generales y de Git están en el `CLAUDE.md` de la raíz.

## Stack

NestJS 12 sobre Express, TypeScript en modo ESM (los imports relativos terminan en `.js`), tests con Vitest y lint con oxlint. Paquete: `albuncito-facilito-api`. Escucha en el puerto 3001 (o `PORT`).

Antes de escribir código de NestJS, consulta la documentación actual (Context7 o https://docs.nestjs.com/llms.txt): esta versión puede diferir de lo que conoces.

## Autenticación

Signup/login con email y contraseña y JWT. Código en `src/`:

- `database/`: `DatabaseService` abre SQLite con `node:sqlite` (`DATABASE_PATH`, por defecto `data/albuncito.db`; `:memory:` en tests) y crea la tabla `users` (`id`, `name`, `slug` único, `email` único, `password_hash`, `created_at`). Módulo global.
- `users/`: `UsersService` (`create`, `findById`, `findBySlug`, `findByEmail`) y `slug.ts` (`slugify`, `uniqueSlug`; slugs reservados `login`, `signup`, `logout`, `api`). El `password_hash` solo sale en `findByEmail`, para el login.
- `auth/`: `PasswordService` (hash scrypt N=2^15, r=8, p=3 con sal aleatoria y `timingSafeEqual`; verifica un hash falso si el email no existe), `AuthService`, `AuthController`, `JwtAuthGuard` (lee `Authorization: Bearer`, verifica el JWT y carga el usuario) y `auth.schemas.ts` (esquemas de zod). Los body se validan con `@Body({ schema })` y `StandardSchemaValidationPipe` (registrado con `APP_PIPE` en `app.module.ts`).
- Endpoints: `POST /auth/signup` (201, 409 si el email existe), `POST /auth/login` (200, 401 genérico) y `GET /auth/me` (guard). Las respuestas de signup/login son `{ accessToken, user: { id, name, slug, email } }`.
- Variables de entorno (`.env`, copia `.env.example`; `pnpm dev`, `pnpm start` y `pnpm start:prod` lo cargan solo): `JWT_SECRET` (obligatorio, la API no arranca sin él), `DATABASE_PATH`, `FRONTEND_URL` (origen permitido por CORS, por defecto `http://localhost:3000`), `PORT`. En los tests se fijan en `vitest.config*.ts`.
- Tests: `src/auth/password.service.spec.ts`, `src/users/slug.spec.ts` y `test/auth.e2e-spec.ts` (signup, email repetido, slugs, validación, login, `/auth/me` y que la BD guarde el hash y no la contraseña).

## Skills

Revisé las skills disponibles. No hay ninguna instalada específica de NestJS ni de testing; estas son las que aplican a este proyecto:

- `context7-mcp`: documentación actual de NestJS y Vitest antes de escribir código (regla "Development" de la raíz).
- `revisar-codigo`: revisión de cambios con las convenciones del proyecto (nombres en inglés, comentarios en español); corre los tests e informa lo que no tenga cobertura.
- `code-review` y `simplify`: buscar errores y limpiar el código modificado.
- `security-review`: revisar la seguridad de los cambios cuando se agreguen endpoints, autenticación o acceso a datos.
- `run`: levantar la API y comprobar un endpoint real.

No instaladas (opcionales): las skills oficiales de NestJS (`npx @nestjs/skills add --agent all`), que cubren errores comunes y recetas de Nest. Para testing se usa Vitest con `@nestjs/testing` y supertest; no hay una skill dedicada.

## Comandos

Desde la raíz del monorepo (recomendado) o desde esta carpeta con `pnpm <script>`:

- Dev: `pnpm dev` (modo watch; necesita `.env` con `JWT_SECRET`)
- Build: `pnpm build`
- Test: `pnpm test` (Vitest, `src/**/*.spec.ts`); e2e: `pnpm test:e2e` (`test/*.e2e-spec.ts`); modo watch: `pnpm test:watch`
- Lint: `pnpm lint` (oxlint con reglas de tipos)
- Start sin watch: `pnpm start`; producción (después del build): `pnpm start:prod`

Verificados dentro de este proyecto: `pnpm dev` (responde en `GET http://localhost:3001/` y en `/auth/*`), `pnpm test`, `pnpm test:e2e`, `pnpm lint` y `pnpm build`.

No hay Prettier ni cobertura: solo las dependencias necesarias para correr, testear y lintear, más `@nestjs/jwt` y `zod` para la autenticación.
