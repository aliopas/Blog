# Quick Deployment Script for Vercel
# استخدم هذا السكريبت لدفع الكود بسرعة

Write-Host "🚀 تحضير المشروع للنشر على Vercel..." -ForegroundColor Cyan
Write-Host ""

# التحقق من التغييرات
Write-Host "📋 فحص التغييرات..." -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "هل تريد إضافة جميع الملفات؟ (Y/N): " -ForegroundColor Green -NoNewline
$response = Read-Host

if ($response -eq "Y" -or $response -eq "y") {
    Write-Host "✅ إضافة جميع الملفات..." -ForegroundColor Cyan
    git add .
    
    Write-Host ""
    Write-Host "📝 أدخل رسالة الـ commit (أو اضغط Enter للرسالة الافتراضية):" -ForegroundColor Green
    $commitMsg = Read-Host
    
    if ([string]::IsNullOrWhiteSpace($commitMsg)) {
        $commitMsg = "Ready for Vercel deployment - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    }
    
    Write-Host "✅ عمل commit..." -ForegroundColor Cyan
    git commit -m "$commitMsg"
    
    Write-Host ""
    Write-Host "🚀 دفع الكود إلى GitHub..." -ForegroundColor Cyan
    git push origin main
    
    Write-Host ""
    Write-Host "✅ تم! الكود الآن على GitHub" -ForegroundColor Green
    Write-Host ""
    Write-Host "الخطوات التالية:" -ForegroundColor Yellow
    Write-Host "1. اذهب إلى https://vercel.com/new" -ForegroundColor White
    Write-Host "2. اختر الريبو من GitHub" -ForegroundColor White
    Write-Host "3. أضف Environment Variables (راجع VERCEL_DEPLOY.md)" -ForegroundColor White
    Write-Host "4. اضغط Deploy!" -ForegroundColor White
    Write-Host ""
    Write-Host "📚 لمزيد من التفاصيل، راجع:" -ForegroundColor Cyan
    Write-Host "   - VERCEL_DEPLOY.md" -ForegroundColor White
    Write-Host "   - DEPLOYMENT_CHECKLIST.md" -ForegroundColor White
    Write-Host "   - READY_FOR_DEPLOYMENT.md" -ForegroundColor White
} else {
    Write-Host "❌ تم الإلغاء" -ForegroundColor Red
}

Write-Host ""
Write-Host "لاستخدام هذا السكريبت مرة أخرى، اكتب: .\deploy-to-github.ps1" -ForegroundColor Gray
