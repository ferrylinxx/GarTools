# 🧪 TEST ANALYTICS - Guía de Prueba

## 📋 Pasos para Probar Analytics

### **1. Verificar Tabla en Supabase**

Ve a Supabase → SQL Editor y ejecuta:

```sql
-- Verificar que la tabla existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'analytics_events';

-- Ver estructura de la tabla
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'analytics_events'
ORDER BY ordinal_position;

-- Ver datos existentes
SELECT * FROM analytics_events 
ORDER BY created_at DESC 
LIMIT 10;
```

### **2. Crear Tabla si No Existe**

Si la tabla no existe, ejecuta este SQL:

```sql
-- Crear tabla analytics_events
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_category TEXT,
  event_data JSONB,
  file_size NUMERIC,
  processing_time INTEGER,
  format_from TEXT,
  format_to TEXT,
  quality TEXT,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON analytics_events(session_id);

-- Agregar comentarios
COMMENT ON TABLE analytics_events IS 'Tabla para tracking de eventos de analytics';
COMMENT ON COLUMN analytics_events.user_id IS 'Usuario que realizó la acción (NULL si no autenticado)';
COMMENT ON COLUMN analytics_events.event_type IS 'Tipo de evento: process, convert, enhance, etc.';
COMMENT ON COLUMN analytics_events.success IS 'Si la acción fue exitosa';
```

### **3. Verificar RLS (Row Level Security)**

```sql
-- Ver políticas actuales
SELECT * FROM pg_policies WHERE tablename = 'analytics_events';

-- Deshabilitar RLS temporalmente para pruebas (SOLO PARA DESARROLLO)
ALTER TABLE analytics_events DISABLE ROW LEVEL SECURITY;

-- O crear política que permita todo (SOLO PARA DESARROLLO)
DROP POLICY IF EXISTS "Allow all operations" ON analytics_events;
CREATE POLICY "Allow all operations" ON analytics_events
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### **4. Probar Inserción Manual**

```sql
-- Insertar evento de prueba
INSERT INTO analytics_events (
  session_id,
  event_type,
  event_category,
  success
) VALUES (
  'test-session-123',
  'process',
  'video',
  true
);

-- Verificar que se insertó
SELECT * FROM analytics_events WHERE session_id = 'test-session-123';
```

### **5. Probar desde la Aplicación**

1. Abre la consola del navegador (F12)
2. Ve a cualquier herramienta (ej: Toolkit)
3. Realiza una acción (descarga un video)
4. Busca en la consola:
   - `📊 Tracking analytics event:` - Debe aparecer
   - `✅ Analytics event saved:` - Debe aparecer
   - `❌ Analytics API error:` - NO debe aparecer

### **6. Verificar en Supabase**

```sql
-- Ver eventos de los últimos 5 minutos
SELECT 
  id,
  user_id,
  event_type,
  event_category,
  success,
  error_message,
  created_at
FROM analytics_events
WHERE created_at > NOW() - INTERVAL '5 minutes'
ORDER BY created_at DESC;
```

### **7. Verificar Variables de Entorno**

Asegúrate de que `.env.local` tiene:

```env
NEXT_PUBLIC_SUPABASE_URL=tu-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

### **8. Reiniciar Servidor**

```bash
# Detener servidor
Ctrl + C

# Limpiar caché
npm run clean
# o
rm -rf .next

# Reiniciar
npm run dev
```

## 🔍 Problemas Comunes

### **Problema 1: Tabla no existe**
**Solución:** Ejecutar SQL del paso 2

### **Problema 2: RLS bloquea inserciones**
**Solución:** Ejecutar SQL del paso 3

### **Problema 3: Service Role Key incorrecta**
**Solución:** Verificar `.env.local` y reiniciar servidor

### **Problema 4: CORS errors**
**Solución:** Verificar que la URL de Supabase sea correcta

### **Problema 5: No aparecen logs en consola**
**Solución:** Limpiar caché del navegador (Ctrl + Shift + Delete)

