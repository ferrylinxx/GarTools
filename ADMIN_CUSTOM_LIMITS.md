# 📋 Guía de Administración: Límites Personalizados por Usuario

## 🎯 Descripción General

El sistema permite establecer límites personalizados para usuarios específicos, sobrescribiendo los límites predeterminados de su plan de suscripción.

## ✨ Creación Automática de Registros

**IMPORTANTE:** Cuando un usuario usa cualquier herramienta por primera vez, el sistema automáticamente crea un registro en `user_custom_limits` con todos los valores en NULL y la nota "Auto-created on first usage".

Esto significa que:
- ✅ No necesitas crear registros manualmente para cada usuario
- ✅ Todos los usuarios activos aparecerán automáticamente en la tabla
- ✅ Solo necesitas editar los valores que quieras personalizar
- ✅ Los valores NULL seguirán usando los límites del plan del usuario

---

## 🗄️ Tabla: `user_custom_limits`

### Estructura de la Tabla

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | UUID | ID único del registro |
| `user_id` | UUID | ID del usuario (FK a `users.id`) |
| `processes_per_day` | INTEGER | Límite diario de descargas |
| `conversions_per_day` | INTEGER | Límite diario de conversiones |
| `enhancements_per_day` | INTEGER | Límite diario de mejoras de audio |
| `compressions_per_day` | INTEGER | Límite diario de compresiones |
| `identifications_per_day` | INTEGER | Límite diario de identificaciones |
| `metadata_edits_per_day` | INTEGER | Límite diario de ediciones de metadata |
| `max_file_size_mb` | INTEGER | Tamaño máximo de archivo (MB) |
| `playlist_max_items` | INTEGER | Máximo de items en playlist |
| `batch_max_files` | INTEGER | Máximo de archivos en batch |
| `gif_max_duration_seconds` | INTEGER | Duración máxima de GIF (segundos) |
| `notes` | TEXT | Notas del administrador |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de última actualización |

---

## 🔧 Cómo Editar Límites desde Supabase

### Paso 1: Acceder a Supabase Dashboard

1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecciona el proyecto **ytprocess**
3. En el menú lateral, haz clic en **Table Editor**
4. Selecciona la tabla `user_custom_limits`

### Paso 2: Obtener el User ID

Primero necesitas el ID del usuario:

1. Ve a la tabla `users`
2. Busca al usuario por email o nombre
3. Copia su `id` (UUID)

### Paso 3: Editar Límites Personalizados

**Nota:** Ya no necesitas crear registros manualmente. El sistema los crea automáticamente cuando el usuario usa una herramienta.

1. En la tabla `user_custom_limits`, busca el registro del usuario
   - Si el usuario ya usó alguna herramienta, su registro existirá
   - Si no existe, espera a que use una herramienta o créalo manualmente
2. Haz clic en la fila para editarla
3. Modifica los valores que deseas personalizar:
   - Deja en NULL los que quieras que usen el límite del plan
   - Pon -1 para ilimitado
   - Pon un número específico para límite personalizado
4. Actualiza el campo `notes` para documentar el cambio
5. Haz clic en **Save**

---

## 📊 Valores Especiales

### NULL (Vacío)
- **Significado**: Usar el límite predeterminado del plan del usuario
- **Ejemplo**: Si `processes_per_day` es NULL, se usará el límite del plan (Free=5, Basic=50, Pro=200, Enterprise=∞)

### -1
- **Significado**: Ilimitado
- **Ejemplo**: `processes_per_day = -1` → Descargas ilimitadas

### Número Positivo
- **Significado**: Límite personalizado específico
- **Ejemplo**: `processes_per_day = 100` → 100 descargas por día

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Usuario VIP con Límites Aumentados

```sql
INSERT INTO user_custom_limits (user_id, processes_per_day, conversions_per_day, notes)
VALUES (
  'uuid-del-usuario',
  500,  -- 500 descargas/día
  300,  -- 300 conversiones/día
  'Usuario VIP - Límites aumentados por promoción especial'
);
```

### Ejemplo 2: Usuario Beta Tester con Acceso Ilimitado

```sql
INSERT INTO user_custom_limits (
  user_id, 
  processes_per_day, 
  conversions_per_day, 
  enhancements_per_day,
  compressions_per_day,
  identifications_per_day,
  metadata_edits_per_day,
  notes
)
VALUES (
  'uuid-del-usuario',
  -1,  -- Ilimitado
  -1,  -- Ilimitado
  -1,  -- Ilimitado
  -1,  -- Ilimitado
  -1,  -- Ilimitado
  -1,  -- Ilimitado
  'Beta Tester - Acceso completo ilimitado'
);
```

### Ejemplo 3: Usuario con Restricción Temporal

```sql
INSERT INTO user_custom_limits (user_id, processes_per_day, notes)
VALUES (
  'uuid-del-usuario',
  2,  -- Solo 2 descargas/día
  'Restricción temporal por abuso del servicio - Revisar en 30 días'
);
```

---

## 🔍 Verificar Límites Actuales de un Usuario

### SQL Query para Ver Límites Efectivos

```sql
SELECT 
  u.email,
  u.name,
  u.subscription_tier,
  ucl.processes_per_day AS custom_processes,
  ucl.conversions_per_day AS custom_conversions,
  ucl.notes
FROM users u
LEFT JOIN user_custom_limits ucl ON u.id = ucl.user_id
WHERE u.email = 'usuario@ejemplo.com';
```

---

## ⚠️ Notas Importantes

1. **Un usuario solo puede tener UN registro** en `user_custom_limits` (constraint UNIQUE en `user_id`)
2. **Los límites personalizados tienen prioridad** sobre los límites del plan
3. **NULL significa "usar default del plan"**, NO significa "sin límite"
4. **-1 significa ilimitado** para ese tipo de acción
5. **Los cambios son inmediatos** - no requiere reiniciar la aplicación
6. **Siempre agrega notas** para documentar por qué se estableció el límite personalizado

---

## 🛠️ Troubleshooting

### El usuario sigue viendo los límites antiguos

1. Verifica que el `user_id` sea correcto
2. Verifica que los valores no sean NULL (a menos que quieras usar defaults)
3. Pide al usuario que cierre sesión y vuelva a iniciar

### Quiero remover los límites personalizados

```sql
DELETE FROM user_custom_limits WHERE user_id = 'uuid-del-usuario';
```

Esto hará que el usuario vuelva a usar los límites de su plan.

---

## 📞 Soporte

Para preguntas o problemas, contacta al equipo de desarrollo.

