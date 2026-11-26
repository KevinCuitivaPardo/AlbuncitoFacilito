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

## Autenticación y rutas

El proyecto usa `cacheComponents`: lo que lee cookies o `params` va dentro de `<Suspense>`. Consulta `node_modules/next/dist/docs/01-app/02-guides/authentication-with-cache-components.md` antes de tocar la sesión.

- `/`: portada con enlaces a login y signup.
- `/signup` (nombre, email, contraseña) y `/login` (email, contraseña): formularios con `useActionState`; los errores de la API se muestran en el formulario.
- `/[username]`: dashboard. El segmento es el `slug` del usuario, no el nombre. Sin sesión redirige a `/login`; si el slug no es el del usuario logueado, redirige al suyo. Las rutas estáticas `/login` y `/signup` tienen prioridad sobre `[username]`.
- `app/actions/auth.ts`: Server Actions `signup`, `login` y `logout`. Tras signup/login guardan el JWT y hacen `redirect('/<slug>')`.
- `app/lib/session.ts`: JWT en la cookie `session` (`httpOnly`, `sameSite: lax`, `secure` en producción, 7 días). El JWT nunca llega al JavaScript del navegador.
- `app/lib/api.ts`: llamadas a la API (`signupRequest`, `loginRequest`, `meRequest`), solo servidor. `app/lib/auth.ts`: `getCurrentUser()` consulta `GET /auth/me` y redirige a `/login` si el token no vale; la API es quien valida el JWT.
- Variable de entorno: `API_URL` (opcional, por defecto `http://localhost:3001`; ver `.env.example`).
- Como la redirección ocurre dentro de `<Suspense>` en streaming, la respuesta HTTP es 200 y el navegador redirige con el HTML que llega después, no con un 307.

## Skills

Revisé las skills disponibles. No hay ninguna instalada específica de React, Next.js ni testing; estas son las que aplican a este proyecto:

- `context7-mcp`: documentación actual de Next.js y React antes de escribir código (regla "Development" de la raíz).
- `revisar-codigo`: revisión de cambios con las convenciones del proyecto (nombres en inglés, comentarios en español).
- `code-review` y `simplify`: buscar errores y limpiar el código modificado.
- `run`: levantar la app y comprobar un cambio en el navegador.

No instaladas (opcionales): los plugins `frontend-design` (calidad visual de la interfaz) y `playwright` (tests end-to-end en el navegador) del marketplace oficial. Para testing aún no hay framework en este proyecto; cuando se elija, agregar aquí la skill que corresponda.

## Comandos

Desde la raíz del monorepo (recomendado) o desde esta carpeta con `pnpm <script>`:

- Dev: `pnpm dev`
- Build: `pnpm build`
- Test: `pnpm test` (todavía no hay framework de tests: el script solo avisa)
- Lint: `pnpm lint` (ESLint)
- Start (después del build): `pnpm start`
