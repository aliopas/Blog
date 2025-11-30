# 🤖 AI Flows Tracking - Blog Application

## 📋 ملخص سريع
التطبيق يستخدم **8 AI Flows** رئيسية كلها بتستخدم **Google Gemini 2.0 Flash Exp**

---

## 🔄 AI Flows (التدفقات)

### 1. **generate-article-outlines**
- **الملف**: `src/ai/flows/generate-article-outlines.ts`
- **الوظيفة**: توليد مخطط المقال (العناوين والأقسام)
- **المدخلات**: Topic (موضوع المقال)
- **المخرجات**: Article outline structure
- **مستخدم في**:
  - `generate-and-process-article.ts` (Flow رئيسي)

---

### 2. **generate-article**
- **الملف**: `src/ai/flows/generate-article.ts`
- **الوظيفة**: كتابة محتوى المقال الكامل
- **المدخلات**: Article outline
- **المخرجات**: Full article content (HTML)
- **مستخدم في**:
  - `generate-and-process-article.ts` (Flow رئيسي)

---

### 3. **check-article-quality**
- **الملف**: `src/ai/flows/check-article-quality.ts`
- **الوظيفة**: فحص جودة المقال
- **المدخلات**: Article content
- **المخرجات**: Quality scores (readability, keyword density, suggestions)
- **مستخدم في**:
  - `generate-and-process-article.ts` (Flow رئيسي)
  - النتائج تظهر في: `src/app/admin/dashboard/review/page.tsx`

---

### 4. **enhance-generated-articles**
- **الملف**: `src/ai/flows/enhance-generated-articles.ts`
- **الوظيفة**: تحسين المقالات المولدة
- **المدخلات**: Article content
- **المخرجات**: Enhanced article
- **مستخدم في**:
  - `generate-and-process-article.ts` (Flow رئيسي)

---

### 5. **generate-and-process-article** ⭐ (Master Flow)
- **الملف**: `src/ai/flows/generate-and-process-article.ts`
- **الوظيفة**: Flow رئيسي يجمع كل العمليات السابقة
- **المدخلات**: Topic
- **المخرجات**: Complete processed article with quality check
- **مستخدم في**:
  - ✅ `src/app/admin/dashboard/generate/page.tsx` - زر "Generate Article"
  - ✅ `src/app/admin/dashboard/review/page.tsx` - عرض النتائج

---

### 6. **categorize-trending-topics**
- **الملف**: `src/ai/flows/categorize-trending-topics.ts`
- **الوظيفة**: اكتشاف وتصنيف المواضيع الرائجة
- **المدخلات**: Search prompts / categories
- **المخرجات**: Trending topics list
- **مستخدم في**:
  - `automated-content-generation.ts`

---

### 7. **automated-content-generation** ⭐
- **الملف**: `src/ai/flows/automated-content-generation.ts`
- **الوظيفة**: توليد محتوى تلقائي كامل (اكتشاف مواضيع + كتابة مقال)
- **المدخلات**: Category (optional)
- **المخرجات**: Generated articles
- **مستخدم في**:
  - ✅ `src/app/admin/dashboard/generate/page.tsx` - زر "Generate Automated Post Now"
  - ✅ `src/app/api/automation/generate/route.ts` - API endpoint

---

### 8. **analyze-traffic-patterns** ⭐
- **الملف**: `src/ai/flows/analyze-traffic-patterns.ts`
- **الوظيفة**: تحليل بيانات الزوار وتقديم رؤى
- **المدخلات**: Traffic data from database
- **المخرجات**: Analysis insights and recommendations
- **مستخدم في**:
  - ✅ `src/app/admin/dashboard/analytics/actions.ts` - Server action

---

## 🎯 AI Commands (الأوامر المستقلة)

تم إنشاء **Commands** مستقلة لكل خطوة في الـ Flow الرئيسي (ماعدا `generate-article-outlines`):

### 1. **categorize-topic**
- **الملف**: `src/ai/commands/categorize-topic.ts`
- **الوظيفة**: تصنيف موضوع أو عدة مواضيع
- **المدخلات**: `{ topics: string[] }`
- **المخرجات**: `{ categoryMap: Record<string, string> }`
- **الاستخدام**: يمكن استدعاؤه من API Routes أو Server Actions

---

### 2. **generate-article-command**
- **الملف**: `src/ai/commands/generate-article-command.ts`
- **الوظيفة**: توليد محتوى مقال كامل من outline
- **المدخلات**: `{ topic: string, outline: string }`
- **المخرجات**: `{ title: string, content: string }`
- **الاستخدام**: يمكن استدعاؤه بشكل مستقل لتوليد مقال

---

### 3. **check-quality-command**
- **الملف**: `src/ai/commands/check-quality-command.ts`
- **الوظيفة**: فحص جودة المقال
- **المدخلات**: `{ content: string, keywords: string }`
- **المخرجات**: `{ readabilityScore: number, keywordDensity: number, suggestions: string[] }`
- **الاستخدام**: يمكن استدعاؤه لفحص أي مقال

---

### 📝 ملاحظات عن الـ Commands:
- ✅ تم استرجاع ملف `check-article-quality.ts` الذي كان محذوفاً
- ✅ كل command له واجهة بسيطة وسهلة الاستخدام
- ✅ كل command يحتوي على logging مدمج
- ✅ يمكن استيراد كل الـ commands من `@/ai/commands`
- ✅ راجع `src/ai/commands/README.md` للمزيد من التفاصيل

---

## 📍 أماكن استخدام الـ AI من قبل المستخدم

### 1. **صفحة Generate** (`src/app/admin/dashboard/generate/page.tsx`)
```typescript
// 🤖 AI USAGE:
// - generateAndProcessArticle (manual generation)
// - triggerContentGeneration (automated generation)
```
**الأزرار**:
- ✅ "Generate Article" → توليد مقال يدوي
- ✅ "Generate Automated Post Now" → توليد تلقائي

---

### 2. **صفحة Review** (`src/app/admin/dashboard/review/page.tsx`)
```typescript
// 🤖 AI USAGE:
// - عرض نتائج Quality Check من الـ AI
// - عرض المحتوى المولد
```
**العرض**:
- ✅ Readability Score
- ✅ Keyword Density
- ✅ AI Suggestions

---

### 3. **Analytics Actions** (`src/app/admin/dashboard/analytics/actions.ts`)
```typescript
// 🤖 AI USAGE:
// - analyzeTrafficPatterns (traffic analysis)
```
**الوظيفة**:
- ✅ تحليل بيانات الزوار بالـ AI

---

### 4. **API Route - Automation** (`src/app/api/automation/generate/route.ts`)
```typescript
// 🤖 AI USAGE:
// - triggerContentGeneration (automated generation)
```
**الاستخدام**:
- ✅ POST `/api/automation/generate`

---

### 5. **API Route - Test AI** (`src/app/api/test-ai/route.ts`)
```typescript
// 🤖 AI USAGE:
// - testApiConnection (test AI connection)
```
**الاستخدام**:
- ✅ GET `/api/test-ai`

---

### 6. **API Route - Test Keys** (`src/app/api/test-keys/route.ts`)
```typescript
// 🤖 AI USAGE:
// - Direct Google Generative AI (test all API keys)
```
**الاستخدام**:
- ✅ GET `/api/test-keys`

---

## 🗂️ ملفات مساعدة

### 1. **src/ai/genkit.ts**
- إعداد Genkit و Gemini
- نظام Key Rotation
- نظام Retry

### 2. **src/ai/test-api.ts**
- اختبار اتصال الـ AI

### 3. **src/lib/api-key-manager.ts**
- إدارة API Keys في Database

---

## 📊 إحصائيات

- **عدد AI Flows**: 8
- **عدد AI Commands**: 3 ✨ (جديد)
- **عدد الصفحات المستخدمة**: 2 (Generate, Review)
- **عدد API Routes**: 3
- **عدد Server Actions**: 1
- **AI Model**: Google Gemini 2.0 Flash Exp
- **Framework**: Genkit

---

**آخر تحديث**: 2025-11-28
