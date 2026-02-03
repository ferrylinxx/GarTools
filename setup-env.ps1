# ============================================
# SCRIPT DE CONFIGURACIÓN DE VARIABLES DE ENTORNO
# external platforms Downloader v5.0.0
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  external platforms Downloader - Setup ENV" -ForegroundColor Cyan
Write-Host "  Version 5.0.0" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si .env ya existe
if (Test-Path ".env") {
    Write-Host "⚠️  El archivo .env ya existe." -ForegroundColor Yellow
    $overwrite = Read-Host "¿Deseas sobrescribirlo? (s/n)"
    if ($overwrite -ne "s") {
        Write-Host "❌ Operación cancelada." -ForegroundColor Red
        exit
    }
}

Write-Host ""
Write-Host "📝 Configuración de Supabase" -ForegroundColor Green
Write-Host "   Ve a: https://supabase.com/dashboard/project/soqainwuxopobrpwofpn/settings/api" -ForegroundColor Gray
Write-Host ""

$supabaseUrl = Read-Host "NEXT_PUBLIC_SUPABASE_URL (default: https://soqainwuxopobrpwofpn.supabase.co)"
if ([string]::IsNullOrWhiteSpace($supabaseUrl)) {
    $supabaseUrl = "https://soqainwuxopobrpwofpn.supabase.co"
}

$supabaseAnonKey = Read-Host "NEXT_PUBLIC_SUPABASE_ANON_KEY (empieza con eyJhbGciOi...)"
$supabaseServiceKey = Read-Host "SUPABASE_SERVICE_ROLE_KEY (empieza con eyJhbGciOi...)"

Write-Host ""
Write-Host "💳 Configuración de Stripe" -ForegroundColor Green
Write-Host "   Ve a: https://dashboard.stripe.com/apikeys" -ForegroundColor Gray
Write-Host ""

$stripeSecretKey = Read-Host "STRIPE_SECRET_KEY (empieza con sk_live_ o sk_test_)"
$stripePublishableKey = Read-Host "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (empieza con pk_live_ o pk_test_)"
$stripeWebhookSecret = Read-Host "STRIPE_WEBHOOK_SECRET (empieza con whsec_)"

# Crear contenido del archivo .env
$envContent = @"
# ============================================
# SUPABASE CONFIGURATION
# ============================================

NEXT_PUBLIC_SUPABASE_URL=$supabaseUrl
NEXT_PUBLIC_SUPABASE_ANON_KEY=$supabaseAnonKey
SUPABASE_SERVICE_ROLE_KEY=$supabaseServiceKey

# ============================================
# STRIPE CONFIGURATION
# ============================================

STRIPE_SECRET_KEY=$stripeSecretKey
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$stripePublishableKey
STRIPE_WEBHOOK_SECRET=$stripeWebhookSecret

# ============================================
# NEXT.JS CONFIGURATION
# ============================================

NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000
HOSTNAME=0.0.0.0
"@

# Guardar archivo .env
$envContent | Out-File -FilePath ".env" -Encoding UTF8

Write-Host ""
Write-Host "✅ Archivo .env creado exitosamente!" -ForegroundColor Green
Write-Host ""

# Preguntar si desea iniciar Docker
Write-Host "🐳 ¿Deseas iniciar el contenedor Docker ahora? (s/n)" -ForegroundColor Cyan
$startDocker = Read-Host

if ($startDocker -eq "s") {
    Write-Host ""
    Write-Host "🔄 Deteniendo contenedor anterior (si existe)..." -ForegroundColor Yellow
    docker stop external-processer 2>$null
    docker rm external-processer 2>$null
    
    Write-Host "🚀 Iniciando contenedor con docker-compose..." -ForegroundColor Green
    docker-compose up -d
    
    Write-Host ""
    Write-Host "✅ Contenedor iniciado!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Ver logs:" -ForegroundColor Cyan
    Write-Host "   docker-compose logs -f" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🌐 Acceder a la aplicación:" -ForegroundColor Cyan
    Write-Host "   http://localhost:3000" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "📝 Para iniciar el contenedor manualmente:" -ForegroundColor Cyan
    Write-Host "   docker-compose up -d" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ Configuración completada!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

