# 📋 GUÍA: Cambiar Planes de Usuarios desde Supabase

## 🎯 Objetivo
Configurar Supabase para que la columna `subscription_tier` muestre un **dropdown con lista de planes** en lugar de un campo de texto libre.

---

## 📝 PASO 1: Ejecutar SQL en Supabase

### **1.1 Abrir SQL Editor**
1. Ve a tu proyecto en Supabase
2. Click en **SQL Editor** en el menú lateral
3. Click en **New query**

### **1.2 Copiar y Ejecutar el Script**
1. Abre el archivo `SUPABASE_SETUP_SUBSCRIPTION_TIER.sql`
2. Copia TODO el contenido
3. Pégalo en el SQL Editor de Supabase
4. Click en **Run** (o presiona `Ctrl + Enter`)

### **1.3 Verificar Resultado**
Deberías ver mensajes de éxito:
```
✅ DROP TYPE
✅ CREATE TYPE
✅ ALTER TABLE
✅ COMMENT ON TYPE
✅ COMMENT ON COLUMN
```

---

## 🎨 PASO 2: Verificar en Table Editor

### **2.1 Ir a la Tabla Users**
1. Click en **Table Editor** en el menú lateral
2. Selecciona la tabla **users**

### **2.2 Editar un Usuario**
1. Click en cualquier fila de usuario
2. Busca la columna **subscription_tier**
3. **¡Ahora debería aparecer un DROPDOWN!** 📋

### **2.3 Opciones Disponibles**
El dropdown mostrará:
- ✅ **free** - Plan gratuito
- ✅ **basic** - Plan básico
- ✅ **pro** - Plan profesional
- ✅ **enterprise** - Plan empresarial

---

## 🔧 PASO 3: Cambiar el Plan de un Usuario

### **Método 1: Desde Table Editor (Interfaz Visual)**

1. **Seleccionar usuario:**
   - Click en la fila del usuario que quieres editar

2. **Cambiar plan:**
   - Click en el campo `subscription_tier`
   - Se abrirá un **dropdown**
   - Selecciona el plan deseado (free, basic, pro, enterprise)

3. **Guardar cambios:**
   - Click en **Save** o presiona `Enter`
   - ✅ El cambio se aplicará inmediatamente

### **Método 2: Desde SQL Editor (Múltiples usuarios)**

```sql
-- Cambiar plan de un usuario específico por email
UPDATE users 
SET subscription_tier = 'pro'
WHERE email = 'usuario@ejemplo.com';

-- Cambiar plan de múltiples usuarios
UPDATE users 
SET subscription_tier = 'basic'
WHERE email IN ('user1@ejemplo.com', 'user2@ejemplo.com');

-- Cambiar todos los usuarios free a basic
UPDATE users 
SET subscription_tier = 'basic'
WHERE subscription_tier = 'free';

-- Dar plan enterprise a un usuario específico
UPDATE users 
SET subscription_tier = 'enterprise'
WHERE id = 'uuid-del-usuario';
```

---

## 📊 PASO 4: Verificar Cambios

### **Ver Distribución de Planes**
```sql
SELECT 
  subscription_tier as plan,
  COUNT(*) as total_usuarios,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as porcentaje
FROM users
GROUP BY subscription_tier
ORDER BY 
  CASE subscription_tier
    WHEN 'free' THEN 1
    WHEN 'basic' THEN 2
    WHEN 'pro' THEN 3
    WHEN 'enterprise' THEN 4
  END;
```

### **Ver Usuarios por Plan**
```sql
-- Ver todos los usuarios Pro
SELECT 
  email,
  name,
  subscription_tier,
  subscription_status,
  created_at
FROM users
WHERE subscription_tier = 'pro'
ORDER BY created_at DESC;
```

---

## 🎯 CASOS DE USO COMUNES

### **Caso 1: Dar Plan Pro a un Beta Tester**
```sql
UPDATE users 
SET 
  subscription_tier = 'pro',
  subscription_status = 'active'
WHERE email = 'betatester@ejemplo.com';
```

### **Caso 2: Degradar Usuario por Falta de Pago**
```sql
UPDATE users 
SET 
  subscription_tier = 'free',
  subscription_status = 'cancelled'
WHERE email = 'usuario@ejemplo.com';
```

### **Caso 3: Upgrade Masivo de Usuarios Free**
```sql
-- Dar plan Basic a los primeros 100 usuarios registrados
UPDATE users 
SET subscription_tier = 'basic'
WHERE subscription_tier = 'free'
  AND id IN (
    SELECT id FROM users 
    WHERE subscription_tier = 'free'
    ORDER BY created_at ASC 
    LIMIT 100
  );
```

### **Caso 4: Plan Enterprise para Empresa**
```sql
-- Dar plan enterprise a todos los usuarios de un dominio
UPDATE users 
SET subscription_tier = 'enterprise'
WHERE email LIKE '%@empresa.com';
```

---

## ⚠️ IMPORTANTE: Sincronización con Stripe

Si estás usando Stripe para pagos, recuerda:

1. **Cambio Manual → Actualizar Stripe:**
```sql
-- Después de cambiar el plan manualmente, 
-- asegúrate de actualizar también stripe_customer_id y stripe_subscription_id
UPDATE users 
SET 
  subscription_tier = 'pro',
  stripe_subscription_id = 'sub_xxxxx'  -- ID de Stripe
WHERE email = 'usuario@ejemplo.com';
```

2. **Webhook de Stripe → Actualiza Automáticamente:**
   - Los webhooks de Stripe ya actualizan `subscription_tier` automáticamente
   - No necesitas hacer nada manual si el pago viene de Stripe

---

## 🔍 TROUBLESHOOTING

### **Problema 1: No aparece el dropdown**
**Solución:**
1. Refresca la página de Supabase (F5)
2. Cierra y vuelve a abrir Table Editor
3. Verifica que el SQL se ejecutó correctamente

### **Problema 2: Error al ejecutar SQL**
**Posibles causas:**
- La columna ya es de tipo ENUM
- Hay valores inválidos en la columna

**Solución:**
```sql
-- Ver valores actuales
SELECT DISTINCT subscription_tier FROM users;

-- Limpiar valores inválidos
UPDATE users 
SET subscription_tier = 'free'
WHERE subscription_tier NOT IN ('free', 'basic', 'pro', 'enterprise');
```

### **Problema 3: Quiero agregar un nuevo plan**
```sql
-- Agregar nuevo plan 'premium'
ALTER TYPE subscription_tier_enum ADD VALUE 'premium';

-- Verificar que se agregó
SELECT enumlabel FROM pg_enum 
WHERE enumtypid = 'subscription_tier_enum'::regtype;
```

---

## ✅ RESULTADO FINAL

Después de seguir esta guía:

✅ La columna `subscription_tier` mostrará un **dropdown**
✅ Solo podrás seleccionar planes válidos
✅ No podrás escribir valores incorrectos
✅ Cambiar planes será **rápido y seguro**
✅ Menos errores humanos

---

## 📸 CAPTURAS ESPERADAS

**ANTES:**
```
subscription_tier: [free____________] (campo de texto)
```

**DESPUÉS:**
```
subscription_tier: [free ▼]
                   ├─ free
                   ├─ basic
                   ├─ pro
                   └─ enterprise
```

---

**¿Necesitas ayuda?** Revisa el archivo `SUPABASE_SETUP_SUBSCRIPTION_TIER.sql` para más detalles técnicos.

