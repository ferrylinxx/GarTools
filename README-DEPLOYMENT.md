# 🚀 GUÍA DE DESPLIEGUE - FGAROLA-TOOLS

Esta guía explica cómo desplegar la aplicación de forma segura usando Docker Compose.

---

## 📋 REQUISITOS PREVIOS

- Docker instalado
- Docker Compose instalado
- Acceso a Supabase (para obtener claves)
- Acceso a Stripe (para obtener claves)

---

## 🔧 CONFIGURACIÓN INICIAL

### 1. Clonar el repositorio

```bash
git clone https://github.com/ferrylinxx/GarTools.git
cd GarTools
```

### 2. Crear archivo `.env` con tus claves

```bash
# Copiar el template
cp .env.example .env

# Editar con tus claves reales
nano .env
```

**Contenido del `.env`** (reemplaza con tus valores reales):

```bash
# SUPABASE
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_clave_service_role_aqui

# STRIPE
STRIPE_SECRET_KEY=sk_live_tu_clave_secreta_aqui
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_tu_clave_publica_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_aqui

# NEXT.JS
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=production
```

### 3. Obtener las claves

#### **Supabase:**
1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a Settings → API
4. Copia:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ (SECRETA)

#### **Stripe:**
1. Ve a: https://dashboard.stripe.com/apikeys
2. Copia:
   - `Secret key` → `STRIPE_SECRET_KEY` ⚠️ (SECRETA)
   - `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Ve a: https://dashboard.stripe.com/webhooks
4. Copia:
   - `Signing secret` → `STRIPE_WEBHOOK_SECRET` ⚠️ (SECRETA)

---

## 🐳 DESPLIEGUE CON DOCKER COMPOSE

### Opción 1: Usar imagen desde Docker Hub (Recomendado)

```bash
# Descargar y ejecutar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Verificar que está corriendo
docker-compose ps
```

### Opción 2: Build local

```bash
# Build la imagen localmente
docker-compose build

# Ejecutar
docker-compose up -d
```

---

## 🔄 ACTUALIZAR LA APLICACIÓN

```bash
# Detener contenedor actual
docker-compose down

# Descargar última versión
docker-compose pull

# Iniciar con nueva versión
docker-compose up -d

# Ver logs
docker-compose logs -f
```

---

## 🛠️ COMANDOS ÚTILES

### Ver logs en tiempo real
```bash
docker-compose logs -f
```

### Reiniciar la aplicación
```bash
docker-compose restart
```

### Detener la aplicación
```bash
docker-compose down
```

### Detener y eliminar volúmenes
```bash
docker-compose down -v
```

### Ver estado de los contenedores
```bash
docker-compose ps
```

### Ejecutar comandos dentro del contenedor
```bash
docker-compose exec fgarola-tools sh
```

---

## 🔍 VERIFICACIÓN

### 1. Verificar que la aplicación está corriendo

```bash
curl http://localhost:3001
```

Deberías ver el HTML de la página principal.

### 2. Verificar health check

```bash
docker inspect fgarola-tools | grep -A 10 Health
```

Debería mostrar `"Status": "healthy"`.

### 3. Verificar logs

```bash
docker-compose logs -f
```

No deberías ver errores relacionados con variables de entorno.

---

## 🚨 SOLUCIÓN DE PROBLEMAS

### Error: "Missing environment variables"

**Causa:** El archivo `.env` no existe o está mal configurado.

**Solución:**
```bash
# Verificar que existe
ls -la .env

# Verificar contenido (sin mostrar valores sensibles)
cat .env | grep -v "KEY\|SECRET"

# Recrear desde template
cp .env.example .env
nano .env
```

### Error: "Cannot connect to Supabase"

**Causa:** Claves de Supabase incorrectas.

**Solución:**
1. Verificar que las claves en `.env` son correctas
2. Verificar que el proyecto de Supabase está activo
3. Reiniciar el contenedor: `docker-compose restart`

### Error: "Stripe authentication failed"

**Causa:** Claves de Stripe incorrectas.

**Solución:**
1. Verificar que usas claves de producción (`sk_live_...`)
2. Verificar que las claves no están revocadas
3. Regenerar claves si es necesario

### El contenedor se reinicia constantemente

**Causa:** Error en la aplicación o health check fallando.

**Solución:**
```bash
# Ver logs detallados
docker-compose logs -f

# Ver últimas 100 líneas
docker-compose logs --tail=100

# Ejecutar sin health check (temporal)
docker-compose up -d --no-healthcheck
```

---

## 🔒 SEGURIDAD

### ⚠️ IMPORTANTE

1. **NUNCA** subas el archivo `.env` a GitHub
2. **NUNCA** compartas tus claves secretas
3. **ROTA** las claves inmediatamente si las expones
4. Usa claves de **prueba** (`sk_test_...`) en desarrollo
5. Usa claves de **producción** (`sk_live_...`) solo en producción

### Verificar que `.env` está en `.gitignore`

```bash
# Verificar
cat .gitignore | grep .env

# Debería mostrar:
# .env
# .env.local
# .env.development
# .env.production
```

### Rotar claves comprometidas

Si expusiste tus claves accidentalmente:

1. **Supabase:**
   - Ve a Settings → API
   - Click en "Reset service_role key"
   - Actualiza `.env` con la nueva clave
   - Reinicia: `docker-compose restart`

2. **Stripe:**
   - Ve a https://dashboard.stripe.com/apikeys
   - Click en "..." → "Roll key"
   - Actualiza `.env` con la nueva clave
   - Reinicia: `docker-compose restart`

---

## 📊 MONITOREO

### Ver uso de recursos

```bash
docker stats fgarola-tools
```

### Ver procesos dentro del contenedor

```bash
docker-compose exec fgarola-tools ps aux
```

### Verificar que NO hay procesos sospechosos

```bash
docker-compose exec fgarola-tools ps aux | grep -E "wget|curl|kok|miner"
```

No debería mostrar nada sospechoso.

---

## 🆘 SOPORTE

Si tienes problemas:

1. Revisa los logs: `docker-compose logs -f`
2. Verifica el archivo `.env`
3. Verifica que las claves son correctas
4. Abre un issue en GitHub: https://github.com/ferrylinxx/GarTools/issues

---

## 📝 NOTAS

- El puerto por defecto es `3001`
- Los archivos temporales se guardan en `/app/temp`
- El contenedor se ejecuta como usuario `nextjs` (no root)
- Health check se ejecuta cada 30 segundos

---

**¡Listo! Tu aplicación debería estar corriendo en http://localhost:3001** 🎉

