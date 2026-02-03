# 🐳 INSTRUCCIONES PARA SUBIR A DOCKER HUB - Versión 5.0.0

## ⚠️ IMPORTANTE: Docker Desktop debe estar corriendo

Antes de ejecutar los comandos, asegúrate de que **Docker Desktop esté corriendo**.

---

## 📋 PASOS PARA SUBIR LA IMAGEN

### **PASO 1: Iniciar Docker Desktop**

1. Abre **Docker Desktop**
2. Espera a que el ícono de Docker en la barra de tareas muestre "Docker Desktop is running"
3. Verifica que Docker está corriendo:
   ```bash
   docker --version
   docker ps
   ```

---

### **PASO 2: Construir la Imagen Docker**

```bash
# Navegar al directorio del proyecto
cd fgarola-tools

# Construir la imagen con tag 5.0.0
docker build -t gabo9803/fgarola-tools:5.0.0 .
```

**Tiempo estimado:** 5-10 minutos

**Salida esperada:**
```
[+] Building 300.5s (20/20) FINISHED
 => [internal] load build definition from Dockerfile
 => => transferring dockerfile: 1.2kB
 => [internal] load .dockerignore
 ...
 => => naming to docker.io/gabo9803/fgarola-tools:5.0.0
```

---

### **PASO 3: Etiquetar como 'latest'**

```bash
# Crear tag adicional 'latest'
docker tag gabo9803/fgarola-tools:5.0.0 gabo9803/fgarola-tools:latest
```

---

### **PASO 4: Verificar las Imágenes**

```bash
# Ver las imágenes creadas
docker images | grep fgarola-tools
```

**Salida esperada:**
```
gabo9803/fgarola-tools   5.0.0    abc123def456   2 minutes ago   1.2GB
gabo9803/fgarola-tools   latest   abc123def456   2 minutes ago   1.2GB
```

---

### **PASO 5: Login en Docker Hub**

```bash
# Iniciar sesión en Docker Hub
docker login
```

**Se te pedirá:**
- Username: `gabo9803`
- Password: [tu contraseña de Docker Hub]

**Salida esperada:**
```
Login Succeeded
```

---

### **PASO 6: Subir la Imagen 5.0.0**

```bash
# Push de la versión 5.0.0
docker push gabo9803/fgarola-tools:5.0.0
```

**Tiempo estimado:** 5-15 minutos (dependiendo de tu conexión)

**Salida esperada:**
```
The push refers to repository [docker.io/gabo9803/fgarola-tools]
5.0.0: digest: sha256:abc123... size: 4567
```

---

### **PASO 7: Subir la Imagen 'latest'**

```bash
# Push del tag 'latest'
docker push gabo9803/fgarola-tools:latest
```

**Salida esperada:**
```
The push refers to repository [docker.io/gabo9803/fgarola-tools]
latest: digest: sha256:abc123... size: 4567
```

---

## ✅ VERIFICACIÓN

### **Verificar en Docker Hub**

1. Ve a https://hub.docker.com/r/gabo9803/fgarola-tools
2. Deberías ver:
   - ✅ Tag `5.0.0`
   - ✅ Tag `latest`
   - ✅ Fecha de actualización reciente

### **Probar la Imagen**

```bash
# Detener contenedor actual (si existe)
docker stop fgarola-tools
docker rm fgarola-tools

# Descargar y ejecutar la nueva versión
docker pull gabo9803/fgarola-tools:5.0.0
docker run -d -p 3000:3000 --name fgarola-tools gabo9803/fgarola-tools:5.0.0

# Verificar que está corriendo
docker ps
```

---

## 🚀 COMANDOS COMPLETOS (COPIAR Y PEGAR)

```bash
# 1. Construir imagen
docker build -t gabo9803/fgarola-tools:5.0.0 .

# 2. Etiquetar como latest
docker tag gabo9803/fgarola-tools:5.0.0 gabo9803/fgarola-tools:latest

# 3. Login en Docker Hub
docker login

# 4. Subir versión 5.0.0
docker push gabo9803/fgarola-tools:5.0.0

# 5. Subir latest
docker push gabo9803/fgarola-tools:latest
```

---

## 📊 CAMBIOS EN VERSIÓN 5.0.0

### **Nuevas Funcionalidades:**
- ✅ Sistema de autenticación completo (Login, Register, Password Reset)
- ✅ Gestión de perfiles con avatar upload
- ✅ Sistema de límites de uso por tier (Free, Basic, Pro, Enterprise)
- ✅ Límites personalizados por usuario desde Supabase
- ✅ Analytics tracking en todas las herramientas
- ✅ Dashboard de analytics
- ✅ Sistema de pagos con Stripe
- ✅ 9 herramientas completas:
  - external platforms Toolkit
  - streaming platforms Toolkit
  - Converter
  - Music Identifier
  - Metadata Editor
  - Audio Enhancer
  - Compressor
  - GIF Converter
  - Playlist Toolkit

### **Mejoras Técnicas:**
- ✅ Integración completa con Supabase
- ✅ Context API para estado global
- ✅ Actualización automática de límites
- ✅ Auto-creación de registros en user_custom_limits
- ✅ Dropdown de planes en Supabase (ENUM type)
- ✅ Logs detallados de analytics

---

## 🔧 TROUBLESHOOTING

### **Error: "Cannot connect to Docker daemon"**
**Solución:** Inicia Docker Desktop y espera a que esté completamente corriendo.

### **Error: "denied: requested access to the resource is denied"**
**Solución:** Ejecuta `docker login` y verifica tus credenciales.

### **Build muy lento**
**Solución:** 
- Asegúrate de tener buena conexión a internet
- Limpia imágenes antiguas: `docker system prune -a`

### **Error: "no space left on device"**
**Solución:**
- Limpia imágenes no usadas: `docker system prune -a`
- Aumenta el espacio de disco en Docker Desktop Settings

---

## 📝 NOTAS

- La versión anterior era `3.1.0`
- La nueva versión es `5.0.0` (salto mayor por cambios significativos)
- El tag `latest` siempre apuntará a la versión más reciente
- Las imágenes antiguas seguirán disponibles en Docker Hub

---

**¿Listo para subir? ¡Ejecuta los comandos y disfruta de la nueva versión!** 🎉

