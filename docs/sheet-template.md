# Setup del Google Sheet

## 1. Crear el Sheet

Crea un Sheet nuevo en Drive llamado "San Antonio — Datos". Crea estas 4 pestañas (en este orden):

### Pestaña `participantes`
| id | nombre | whatsapp | fecha_alta | estado | notas |

### Pestaña `turnos`
| id | participante_id | estado | posicion | fecha_inicio | fecha_fin_est | fecha_fin_real |

### Pestaña `testimonios`
| id | participante_id | fecha | encontro_pareja | texto | publicar |

### Pestaña `config`
| duracion_dias | nombre_grupo | mensaje_madrina | oracion_principal |
| 9 | San Antonio Familiar | (texto que sale en home) | (texto largo de la oración) |

Llena la pestaña `config` con UNA fila debajo del header.

## 2. Publicar como CSV

- Archivo → Compartir → Publicar en la web.
- "Documento entero" o pestaña por pestaña; el frontend usa la URL base con `&gid=<gid>`.
- En "Vínculo": elige "Valores separados por comas (.csv)".
- Click "Publicar".

Copia la URL base: `https://docs.google.com/spreadsheets/d/e/<KEY>/pub?output=csv`.

## 3. Encontrar los GIDs de cada pestaña

Click en cada pestaña; la URL del navegador termina en `#gid=NNNNN`. Copia los 4 números.

## 4. Pegar en `index.html`

```js
window.SAN_ANTONIO_CONFIG = {
  sheetCsvBase: 'https://docs.google.com/spreadsheets/d/e/<KEY>/pub?output=csv',
  appsScriptUrl: '...',
  turnoDays: 9,
  groupName: 'San Antonio'
};
```

Y en `src/config.js`:

```js
export const SHEET_GIDS = {
  participantes: 'GID_DE_PARTICIPANTES',
  turnos: 'GID_DE_TURNOS',
  testimonios: 'GID_DE_TESTIMONIOS',
  config: 'GID_DE_CONFIG'
};
```

## 5. Compartir con la madrina

- Click "Compartir" en el Sheet.
- Agrega el email de la madrina como Editora.
- Ella podrá editar todo desde Drive: reordenar la cola, marcar completados, aprobar testimonios.

## Operaciones diarias de la madrina

- **Promover el siguiente turno:** abrir `turnos`, en la fila `activo` cambiar a `completado`, llenar `fecha_fin_real`. Tomar la siguiente fila `en_cola` (posición 1) y cambiarla a `activo`, poner `fecha_inicio = hoy`, `fecha_fin_est = +9 días`.
- **Aprobar un testimonio:** abrir `testimonios`, cambiar `publicar` de `no` a `si`.
- **Reordenar la cola:** editar la columna `posicion` de las filas `en_cola`.
- **Editar mensaje de home:** abrir `config`, editar `mensaje_madrina`.
