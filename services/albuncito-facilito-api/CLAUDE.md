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

## Comandos

Desde la raíz del monorepo (recomendado) o desde esta carpeta con `pnpm <script>`:

- Dev: `pnpm dev` (modo watch)
- Build: `pnpm build`
- Test: `pnpm test` (Vitest, `src/**/*.spec.ts`); e2e: `pnpm test:e2e` (`test/*.e2e-spec.ts`); modo watch: `pnpm test:watch`
- Lint: `pnpm lint` (oxlint con reglas de tipos)
- Start sin watch: `pnpm start`; producción (después del build): `pnpm start:prod`

Verificados dentro de este proyecto: `pnpm dev` (responde en `GET http://localhost:3001/`), `pnpm test`, `pnpm test:e2e` y `pnpm lint`.

No hay Prettier ni cobertura: el setup solo incluye lo necesario para correr, testear y lintear.
