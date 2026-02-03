-- ============================================
-- CONFIGURAR SUBSCRIPTION_TIER COMO ENUM
-- ============================================
-- Este script configura la columna subscription_tier 
-- para que muestre un dropdown en Supabase con los planes disponibles

-- PASO 1: Crear el tipo ENUM con los planes
-- ============================================

-- Primero, verificar si el tipo ya existe y eliminarlo si es necesario
DROP TYPE IF EXISTS subscription_tier_enum CASCADE;

-- Crear el tipo ENUM con todos los planes
CREATE TYPE subscription_tier_enum AS ENUM (
  'free',
  'basic',
  'pro',
  'enterprise'
);

-- PASO 2: Modificar la columna para usar el ENUM
-- ============================================

-- Cambiar el tipo de la columna subscription_tier a ENUM
ALTER TABLE users 
  ALTER COLUMN subscription_tier TYPE subscription_tier_enum 
  USING subscription_tier::subscription_tier_enum;

-- Establecer valor por defecto
ALTER TABLE users 
  ALTER COLUMN subscription_tier SET DEFAULT 'free'::subscription_tier_enum;

-- PASO 3: Agregar comentarios para documentación
-- ============================================

COMMENT ON TYPE subscription_tier_enum IS 'Planes de suscripción disponibles: free, basic, pro, enterprise';
COMMENT ON COLUMN users.subscription_tier IS 'Plan de suscripción del usuario (free, basic, pro, enterprise)';

-- PASO 4: Verificar la configuración
-- ============================================

-- Ver los valores permitidos del ENUM
SELECT 
  enumlabel as plan_name,
  enumsortorder as order_number
FROM pg_enum
WHERE enumtypid = 'subscription_tier_enum'::regtype
ORDER BY enumsortorder;

-- Ver la estructura de la columna
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'users' 
  AND column_name = 'subscription_tier';

-- PASO 5: Actualizar usuarios existentes (si es necesario)
-- ============================================

-- Convertir valores NULL a 'free'
UPDATE users 
SET subscription_tier = 'free'::subscription_tier_enum 
WHERE subscription_tier IS NULL;

-- Verificar que todos los usuarios tienen un plan válido
SELECT 
  subscription_tier,
  COUNT(*) as user_count
FROM users
GROUP BY subscription_tier
ORDER BY subscription_tier;

-- ============================================
-- RESULTADO ESPERADO EN SUPABASE
-- ============================================
-- Ahora cuando edites un usuario en Supabase Table Editor:
-- 1. La columna subscription_tier mostrará un dropdown
-- 2. Las opciones serán: free, basic, pro, enterprise
-- 3. No podrás escribir valores inválidos
-- 4. El valor por defecto será 'free'

-- ============================================
-- CÓMO AGREGAR NUEVOS PLANES EN EL FUTURO
-- ============================================
-- Si necesitas agregar un nuevo plan (ej: 'premium'):

-- ALTER TYPE subscription_tier_enum ADD VALUE 'premium';

-- Nota: Los valores ENUM no se pueden eliminar fácilmente.
-- Si necesitas eliminar un plan, tendrás que:
-- 1. Crear un nuevo ENUM sin ese valor
-- 2. Migrar los datos
-- 3. Reemplazar el tipo antiguo

-- ============================================
-- ROLLBACK (Si algo sale mal)
-- ============================================
-- Para volver al tipo TEXT:

-- ALTER TABLE users 
--   ALTER COLUMN subscription_tier TYPE TEXT 
--   USING subscription_tier::TEXT;
-- 
-- DROP TYPE IF EXISTS subscription_tier_enum CASCADE;

