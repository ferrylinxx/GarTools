#!/bin/bash

# ============================================
# SCRIPT DE CONFIGURACIÓN DE VARIABLES DE ENTORNO
# GarTools v5.0.0
# ============================================

echo "========================================"
echo "  GarTools - Setup ENV"
echo "  Version 5.0.0"
echo "========================================"
echo ""

# Verificar si .env ya existe
if [ -f ".env" ]; then
    echo "⚠️  El archivo .env ya existe."
    read -p "¿Deseas sobrescribirlo? (s/n): " overwrite
    if [ "$overwrite" != "s" ]; then
        echo "❌ Operación cancelada."
        exit 1
    fi
fi

echo ""
echo "📝 Configuración de Supabase"
echo "   Ve a: https://supabase.com/dashboard/project/soqainwuxopobrpwofpn/settings/api"
echo ""

read -p "NEXT_PUBLIC_SUPABASE_URL (default: https://soqainwuxopobrpwofpn.supabase.co): " supabase_url
supabase_url=${supabase_url:-https://soqainwuxopobrpwofpn.supabase.co}

read -p "NEXT_PUBLIC_SUPABASE_ANON_KEY (empieza con eyJhbGciOi...): " supabase_anon_key
read -p "SUPABASE_SERVICE_ROLE_KEY (empieza con eyJhbGciOi...): " supabase_service_key

echo ""
echo "💳 Configuración de Stripe"
echo "   Ve a: https://dashboard.stripe.com/apikeys"
echo ""

read -p "STRIPE_SECRET_KEY (empieza con sk_live_ o sk_test_): " stripe_secret_key
read -p "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (empieza con pk_live_ o pk_test_): " stripe_publishable_key
read -p "STRIPE_WEBHOOK_SECRET (empieza con whsec_): " stripe_webhook_secret

# Crear archivo .env
cat > .env << EOF
# ============================================
# SUPABASE CONFIGURATION
# ============================================

NEXT_PUBLIC_SUPABASE_URL=$supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=$supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=$supabase_service_key

# ============================================
# STRIPE CONFIGURATION
# ============================================

STRIPE_SECRET_KEY=$stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$stripe_publishable_key
STRIPE_WEBHOOK_SECRET=$stripe_webhook_secret

# ============================================
# NEXT.JS CONFIGURATION
# ============================================

NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000
HOSTNAME=0.0.0.0
EOF

echo ""
echo "✅ Archivo .env creado exitosamente!"
echo ""

# Preguntar si desea iniciar Docker
read -p "🐳 ¿Deseas iniciar el contenedor Docker ahora? (s/n): " start_docker

if [ "$start_docker" = "s" ]; then
    echo ""
    echo "🔄 Deteniendo contenedor anterior (si existe)..."
    docker stop fgarola-tools 2>/dev/null
    docker rm fgarola-tools 2>/dev/null
    
    echo "🚀 Iniciando contenedor con docker-compose..."
    docker-compose up -d
    
    echo ""
    echo "✅ Contenedor iniciado!"
    echo ""
    echo "📊 Ver logs:"
    echo "   docker-compose logs -f"
    echo ""
    echo "🌐 Acceder a la aplicación:"
    echo "   http://localhost:3000"
    echo ""
else
    echo ""
    echo "📝 Para iniciar el contenedor manualmente:"
    echo "   docker-compose up -d"
    echo ""
fi

echo "========================================"
echo "  ✅ Configuración completada!"
echo "========================================"

