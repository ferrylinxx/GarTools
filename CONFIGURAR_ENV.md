# 🔧 GUÍA RÁPIDA: Configurar Variables de Entorno

## ⚠️ PROBLEMA ACTUAL

Los errores que ves en Docker son porque **faltan las variables de entorno** de Supabase y Stripe.

```
Error: Your project's URL and Key are required to create a Supabase client!
STRIPE_SECRET_KEY is not set in environment variables
NEXT_PUBLIC_SUPABASE_URL is not set in environment variables
```

---

## ✅ SOLUCIÓN RÁPIDA (3 PASOS)

### **PASO 1: Crear archivo `.env`**

En la carpeta `fgarola-tools`, crea un archivo llamado `.env` (sin extensión):

```bash
# En Windows (PowerShell)
cd fgarola-tools
New-Item -Path .env -ItemType File

# En Linux/Mac
cd fgarola-tools
touch .env
```

### **PASO 2: Copiar configuración**

Abre el archivo `.env` y pega esto (reemplaza con tus valores reales):

```env
# ============================================
# SUPABASE CONFIGURATION
# ============================================

NEXT_PUBLIC_SUPABASE_URL=https://soqainwuxopobrpwofpn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY_AQUI
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY_AQUI

# ============================================
# STRIPE CONFIGURATION
# ============================================

STRIPE_SECRET_KEY=TU_STRIPE_SECRET_KEY_AQUI
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=TU_STRIPE_PUBLISHABLE_KEY_AQUI
STRIPE_WEBHOOK_SECRET=TU_WEBHOOK_SECRET_AQUI

# ============================================
# NEXT.JS CONFIGURATION
# ============================================

NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### **PASO 3: Obtener las claves**

#### **A) Claves de Supabase:**

1. Ve a: https://supabase.com/dashboard/project/soqainwuxopobrpwofpn/settings/api
2. Copia:
   - **URL**: `https://soqainwuxopobrpwofpn.supabase.co`
   - **anon/public key**: Empieza con `eyJhbGciOi...`
   - **service_role key**: Empieza con `eyJhbGciOi...` (diferente al anon)

#### **B) Claves de Stripe:**

1. Ve a: https://dashboard.stripe.com/apikeys
2. Copia:
   - **Secret key**: Empieza con `sk_live_...` o `sk_test_...`
   - **Publishable key**: Empieza con `pk_live_...` o `pk_test_...`

3. Para el webhook secret:
   - Ve a: https://dashboard.stripe.com/webhooks
   - Copia el **Signing secret**: Empieza con `whsec_...`

---

## 🚀 REINICIAR DOCKER

Después de crear el archivo `.env`:

```bash
# Detener contenedor actual
docker stop fgarola-tools
docker rm fgarola-tools

# Iniciar con docker-compose (lee el .env automáticamente)
docker-compose up -d

# Ver logs para verificar
docker-compose logs -f
```

O si usas `docker run`:

```bash
docker run -d \
  --name fgarola-tools \
  -p 3000:3000 \
  --env-file .env \
  gabo9803/fgarola-tools:5.0.0
```

---

## 🔍 VERIFICAR QUE FUNCIONA

### **1. Ver logs (no deben aparecer errores):**
```bash
docker logs fgarola-tools
```

### **2. Verificar variables dentro del contenedor:**
```bash
docker exec fgarola-tools env | grep SUPABASE
docker exec fgarola-tools env | grep STRIPE
```

### **3. Acceder a la aplicación:**
```
http://localhost:3000
```

---

## 📋 EJEMPLO COMPLETO DE `.env`

```env
# SUPABASE (Proyecto: ytprocess - soqainwuxopobrpwofpn)
NEXT_PUBLIC_SUPABASE_URL=https://soqainwuxopobrpwofpn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvcWFpbnd1eG9wb2JycHdvZnBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1MzY5MzMsImV4cCI6MjA1MzExMjkzM30.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvcWFpbnd1eG9wb2JycHdvZnBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzUzNjkzMywiZXhwIjoyMDUzMTEyOTMzfQ.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# STRIPE
STRIPE_SECRET_KEY=sk_live_51XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# NEXT.JS
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

---

## ⚠️ IMPORTANTE: SEGURIDAD

1. **NUNCA** subas el archivo `.env` a Git
2. El archivo `.gitignore` ya incluye `.env`
3. Usa `.env.example` como plantilla (sin valores reales)
4. En producción, usa variables de entorno del servidor

---

## 🐛 TROUBLESHOOTING

### **Error: "Cannot append headers after they are sent"**
- Esto es normal durante el build
- Solo importa que NO aparezca en runtime

### **Error: "NEXT_PUBLIC_SUPABASE_URL is not set"**
- Verifica que el archivo `.env` existe
- Verifica que usas `--env-file .env` o `docker-compose`
- Reinicia el contenedor

### **Error: "STRIPE_SECRET_KEY is not set"**
- Verifica que la clave empieza con `sk_live_` o `sk_test_`
- Verifica que no tiene espacios al inicio/final

---

## ✅ CHECKLIST

- [ ] Archivo `.env` creado en `fgarola-tools/`
- [ ] Claves de Supabase copiadas desde dashboard
- [ ] Claves de Stripe copiadas desde dashboard
- [ ] Contenedor reiniciado con `docker-compose up -d`
- [ ] Logs verificados sin errores
- [ ] Aplicación accesible en http://localhost:3000

---

**¿Necesitas ayuda para obtener las claves?** Puedo guiarte paso a paso. 🚀

