# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Producto

AlbuncitoFacilito es una aplicación para coleccionar álbumes de Cody y llevar el control de los stickers de cada álbum: cuáles tengo, cuáles me faltan y cuáles están repetidos.

El producto tiene 2 partes, y cada una tiene su propio `CLAUDE.md`:

- **Frontend**: `apps/albuncito-facilito-app`, la interfaz que usa el coleccionista.
- **Backend (API)**: `services/albuncito-facilito-api`, que guarda los álbumes, los stickers y la colección de cada usuario.

El frontend consume la API: no accede a los datos directamente.

## Reglas generales

- Responde siempre en español.
- Stack: pendiente, todavía no se han elegido las tecnologías.
- Nombres de variables en inglés y comentarios en español.
- Antes de hacer un commit, corre los tests si existen.

## Git

- Solo hago commits cuando el usuario lo pida.
- Ni los commits ni los PR llevan atribución a Claude: sin `Co-Authored-By: Claude` ni "Generated with Claude Code".
