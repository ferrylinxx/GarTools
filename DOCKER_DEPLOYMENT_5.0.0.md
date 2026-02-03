# 🐳 Docker Deployment - Version 5.0.0

## ✅ **IMAGEN PUBLICADA EN DOCKER HUB**

**Repositorio:** `gabo9803/fgarola-tools`  
**Versión:** `5.0.0`  
**Tag Latest:** `latest`  
**Tamaño:** 743 MB  
**Fecha:** 2026-01-22

---

## 📦 **NOVEDADES DE LA VERSIÓN 5.0.0**

### **Nuevas Funcionalidades:**
1. ✅ **Sistema de Autenticación Completo**
   - Login, Register, Forgot Password, Reset Password
   - Integración con Supabase Auth
   - Middleware de protección de rutas

2. ✅ **Sistema de Límites de Uso**
   - Límites por tier (Free, Basic, Pro, Enterprise)
   - Límites personalizados por usuario
   - Auto-creación de registros en primera uso
   - Actualización automática sin recargar página

3. ✅ **Sistema de Analytics**
   - Tracking de todas las herramientas (8 tools)
   - Dashboard de analytics
   - Logs detallados para debugging

4. ✅ **Gestión de Perfil**
   - Edición de nombre
   - Upload de avatar a Supabase Storage
   - Cambio de contraseña
   - Eliminación de cuenta
   - Avatar visible en menú

5. ✅ **Sistema de Planes (Dropdown en Supabase)**
   - Tipo ENUM para subscription_tier
   - Dropdown en Supabase Table Editor
   - Valores: free, basic, pro, enterprise

6. ✅ **Integración con Stripe**
   - Checkout sessions
   - Customer portal
   - Webhooks
   - Payment history

### **Mejoras Técnicas:**
- ✅ Variables de entorno con fallbacks para build
- ✅ Validación solo en runtime (no en build time)
- ✅ Logs mejorados para debugging
- ✅ Optimización de build de Docker

---

## 🚀 **CÓMO USAR LA IMAGEN**

### **Opción 1: Docker Run (Rápido)**

```bash
docker run -d \
  --name fgarola-tools \
  -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=tu-url-supabase \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key \
  -e SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key \
  -e STRIPE_SECRET_KEY=tu-stripe-secret-key \
  -e NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu-stripe-publishable-key \
  -e STRIPE_WEBHOOK_SECRET=tu-webhook-secret \
  gabo9803/fgarola-tools:5.0.0
```

### **Opción 2: Docker Compose (Recomendado)**

Crea un archivo `docker-compose.yml`:

```yaml
version: '3.8'

services:
  fgarola-tools:
    image: gabo9803/fgarola-tools:5.0.0
    container_name: fgarola-tools
    ports:
      - "3000:3000"
    environment:
      # Supabase
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      
      # Stripe
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
      - STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
      
      # Next.js
      - NODE_ENV=production
      - NEXT_TELEMETRY_DISABLED=1
    
    volumes:
      - ./temp:/app/temp
    
    restart: unless-stopped
    
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

Luego ejecuta:

```bash
docker-compose up -d
```

### **Opción 3: Usar Tag Latest**

```bash
docker pull gabo9803/fgarola-tools:latest
docker run -d -p 3000:3000 --env-file .env gabo9803/fgarola-tools:latest
```

---

## 🔧 **VARIABLES DE ENTORNO REQUERIDAS**

Crea un archivo `.env` con:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_tu-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_tu-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_tu-webhook-secret

# Next.js Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

---

## 📊 **VERIFICAR DEPLOYMENT**

### **1. Verificar que el contenedor está corriendo:**
```bash
docker ps | grep fgarola-tools
```

### **2. Ver logs:**
```bash
docker logs fgarola-tools
```

### **3. Ver logs en tiempo real:**
```bash
docker logs -f fgarola-tools
```

### **4. Verificar health check:**
```bash
docker inspect fgarola-tools | grep -A 10 Health
```

### **5. Acceder a la aplicación:**
```
http://localhost:3000
```

---

## 🔄 **ACTUALIZAR A NUEVA VERSIÓN**

```bash
# Detener contenedor actual
docker stop fgarola-tools

# Eliminar contenedor
docker rm fgarola-tools

# Pull nueva versión
docker pull gabo9803/fgarola-tools:5.0.0

# Iniciar nuevo contenedor
docker run -d --name fgarola-tools -p 3000:3000 --env-file .env gabo9803/fgarola-tools:5.0.0
```

---

## 📝 **HISTORIAL DE VERSIONES**

| Versión | Fecha | Tamaño | Novedades |
|---------|-------|--------|-----------|
| **5.0.0** | 2026-01-22 | 743 MB | Auth, Limits, Analytics, Profile, Stripe, Supabase ENUM |
| 3.1.0 | 2025-10-XX | 725 MB | Playlist, Analytics, Monetization |
| 2.7.0 | 2025-10-XX | 718 MB | Audio Enhancer, Compressor, GIF Converter |
| 2.2.0 | 2025-10-XX | 716 MB | Converter, Music Identifier, Metadata Editor |

---

## 🐛 **TROUBLESHOOTING**

### **Problema: Contenedor no inicia**
```bash
# Ver logs detallados
docker logs fgarola-tools

# Verificar variables de entorno
docker exec fgarola-tools env | grep SUPABASE
```

### **Problema: Error de Supabase**
- Verificar que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` están configuradas
- Verificar que el proyecto de Supabase está activo

### **Problema: Error de Stripe**
- Verificar que `STRIPE_SECRET_KEY` está configurada
- Verificar que la key es válida (empieza con `sk_live_` o `sk_test_`)

---

## 🌐 **DEPLOYMENT EN PRODUCCIÓN**

### **Railway:**
```bash
railway up
```

### **Render:**
1. Conectar repositorio
2. Seleccionar Docker
3. Configurar variables de entorno
4. Deploy

### **DigitalOcean:**
```bash
doctl apps create --spec .do/app.yaml
```

---

**¡Imagen lista para usar en producción!** 🚀

