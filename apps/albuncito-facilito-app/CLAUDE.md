# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué hace

Frontend de AlbuncitoFacilito: la aplicación que usa el coleccionista para ver sus álbumes de Cody y marcar sus stickers como "tengo", "me falta" o "repetido".

## Comunicación con el backend

Esta app consume la API de `services/albuncito-facilito-api`. Todos los datos (álbumes, stickers y la colección del usuario) se leen y se guardan a través de esa API; el frontend no guarda la colección por su cuenta.

Las reglas generales y de Git están en el `CLAUDE.md` de la raíz.

## Stack

Next.js 16 (App Router, Turbopack) con React 19, TypeScript y Tailwind CSS 4. Paquete: `albuncito-facilito-app`. Corre en el puerto 3000.

Antes de escribir código de Next.js, consulta la documentación actual (Context7 o `node_modules/next/dist/docs/`): esta versión puede diferir de lo que conoces.

## Comandos

Desde la raíz del monorepo (recomendado) o desde esta carpeta con `pnpm <script>`:

- Dev: `pnpm dev`
- Build: `pnpm build`
- Test: `pnpm test` (todavía no hay framework de tests: el script solo avisa)
- Lint: `pnpm lint` (ESLint)
- Start (después del build): `pnpm start`
