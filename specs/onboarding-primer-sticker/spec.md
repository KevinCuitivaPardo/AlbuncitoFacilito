# Spec: Onboarding del primer sticker

## Resumen

Después de crear su cuenta, el usuario pasa por un flujo corto de onboarding en el que elige un álbum y marca su primer sticker como "tengo", todo en la misma sesión del registro. Al terminar llega a su dashboard con su colección ya iniciada.

## Por qué

- **Adquisición de usuarios:** la empresa quiere que quien se registra viva el valor del producto de inmediato (empezar a coleccionar) y no se quede con una cuenta vacía.
- **Hoy no hay nada que hacer tras el registro:** el signup lleva a un dashboard que solo dice "Hola, {nombre}". El usuario no tiene un primer paso claro, y no existen álbumes ni stickers en el sistema.
- **Activación medible:** un usuario que agrega un sticker en su primera sesión ya tiene datos propios en la app, y eso es el indicador de activación que la empresa quiere seguir.

## Objetivo y métrica de éxito

**Objetivo:** que el mayor número posible de usuarios nuevos agregue al menos un sticker a su colección durante la sesión en la que se registran.

**Métrica principal (tasa de activación):** usuarios nuevos que completan el onboarding (agregan ≥ 1 sticker) / usuarios nuevos registrados.

**Métrica complementaria:** porcentaje de usuarios que omiten el onboarding, para saber si el flujo genera fricción.

Para poder calcular ambas, el sistema debe conservar el resultado del onboarding de cada usuario (completado u omitido). No se fija una meta numérica en esta spec.

## Usuarios

Personas que acaban de crear una cuenta con email y contraseña. Los usuarios que ya existen antes de este cambio no entran en el flujo.

## Alcance

### Incluido

1. **Catálogo mínimo precargado:** al menos un álbum de ejemplo con varios stickers, disponible desde el primer arranque del sistema, sin que nadie tenga que cargarlo a mano.
2. **Colección del usuario:** el sistema puede guardar qué stickers tiene cada usuario (estado "tengo").
3. **Página `/onboarding`:** tras un signup exitoso, el usuario llega a esta página, elige un álbum y marca un sticker como "tengo".
4. **Confirmación:** al agregar el sticker, el usuario ve un mensaje de éxito y un botón para ir a su dashboard.
5. **Omitir:** un enlace "Omitir" lleva al dashboard sin agregar nada.
6. **Registro del resultado:** se guarda si el usuario completó u omitió el onboarding.

### Fuera de alcance

- Catálogo completo de álbumes de Cody y su carga masiva.
- Estados "me falta" y "repetido", y cualquier pantalla de gestión de la colección.
- Cambios al dashboard más allá de ser el destino al terminar u omitir.
- Onboarding para quien inicia sesión (login): el flujo ocurre solo justo después del signup.
- Reenviar al onboarding a quien lo omitió, recordatorios por email y analítica externa.

## Requisitos funcionales

1. Tras un signup exitoso, el usuario es llevado a `/onboarding` en lugar de a `/[slug]`.
2. `/onboarding` requiere sesión: sin sesión redirige a `/login`.
3. La página muestra los álbumes disponibles y, al elegir uno, sus stickers. Si solo hay un álbum, se puede mostrar ya seleccionado.
4. El usuario puede marcar exactamente un sticker como "tengo" para completar el onboarding.
5. Al marcarlo, el sticker queda guardado en la colección del usuario y se muestra la confirmación con el botón al dashboard.
6. "Omitir" está visible en todo momento y lleva a `/[slug]`.
7. Si el usuario ya completó u omitió el onboarding, entrar a `/onboarding` lo lleva a su dashboard (no se repite).
8. El login de un usuario existente sigue llevando a `/[slug]`, como hoy.
9. Un usuario solo puede agregar stickers a su propia colección.

## Casos límite

- **Recarga de página durante el onboarding:** el usuario sigue en `/onboarding` sin perder su avance.
- **Marcar dos veces el mismo sticker (doble clic, reintento):** la colección queda con un solo registro; no hay error visible.
- **Falla al guardar (API caída o error):** se muestra un mensaje claro y el usuario puede reintentar u omitir.
- **Navegar a otra ruta durante el onboarding sin completarlo:** no se considera omitido; al volver a `/onboarding` puede continuar. *(Ver pregunta abierta 2.)*

## Criterios de aceptación

- [ ] Un usuario recién registrado aterriza en `/onboarding`, no en el dashboard.
- [ ] Puede elegir un álbum, marcar un sticker y ver la confirmación; luego llega a `/[slug]`.
- [ ] El sticker marcado queda guardado y asociado solo a ese usuario.
- [ ] "Omitir" lleva a `/[slug]` sin guardar ningún sticker.
- [ ] Un usuario que ya terminó u omitió el onboarding y entra a `/onboarding` es redirigido a su dashboard.
- [ ] Sin sesión, `/onboarding` redirige a `/login`.
- [ ] Un usuario que inicia sesión (no signup) llega a su dashboard, no al onboarding.
- [ ] Marcar el mismo sticker dos veces no duplica el registro.
- [ ] Se puede obtener, a partir de los datos guardados, cuántos usuarios completaron y cuántos omitieron el onboarding.

## Supuestos

- Un solo sticker basta para considerar el onboarding completado.
- "Misma sesión" significa el flujo inmediatamente posterior al signup, sin importar cuánto tarde el usuario.
- El onboarding usa los textos en español y el estilo visual actual de `/signup` y `/login`.

## Preguntas abiertas

1. **Contenido del álbum de ejemplo:** ¿cuál es el nombre del álbum, cuántos stickers tiene y cómo se llaman? Se propone un álbum con unos 10 stickers de nombre genérico hasta que el equipo de contenido entregue los reales.
2. **Navegación a medias:** si el usuario abandona `/onboarding` sin completarlo ni omitirlo (cierra la pestaña, escribe otra URL), ¿se le vuelve a mostrar el onboarding en su próximo acceso a `/[slug]`, o se considera omitido? La spec propone que no se le fuerce: queda pendiente y solo se muestra si entra a `/onboarding`.
3. **Meta de activación:** ¿existe un objetivo numérico (por ejemplo, 40 % de activación) con el que comparar el resultado?
