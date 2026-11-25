---
name: revisar-codigo
description: Revisa los cambios pendientes del repo (o los archivos indicados) buscando errores y verificando las convenciones del proyecto. Úsala cuando el usuario pida revisar código, un diff o un archivo.
---

# Revisar código

Revisa el código y entrega un informe en español. No modifiques archivos ni hagas commits salvo que el usuario lo pida.

## Qué revisar

1. Si el usuario indicó archivos o una rama, revisa eso. Si no, revisa los cambios pendientes:
   - `git diff` y `git diff --staged`
   - Archivos nuevos sin seguimiento: `git status --porcelain`
2. Lee el contexto necesario alrededor de cada cambio antes de opinar.

## Qué buscar

- **Errores**: lógica incorrecta, casos borde sin manejar, `null`/`undefined`, errores de índice, condiciones de carrera.
- **Convenciones del proyecto** (ver `CLAUDE.md`):
  - Nombres de variables, funciones y clases en inglés.
  - Comentarios en español.
- **Tests**: si hay tests en el proyecto, córrelos e informa el resultado. Señala la lógica nueva que no tenga tests.
- **Simplicidad**: código duplicado o innecesariamente complejo.

## Formato del informe

Ordena los hallazgos de más a menos grave. Para cada uno:

- `archivo:línea`
- Qué está mal y por qué.
- Cómo arreglarlo, en una o dos líneas.

Si no encuentras problemas, dilo claramente. Termina con un resumen de una línea.
