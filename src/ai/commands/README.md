# 🤖 AI Commands

هذا المجلد يحتوي على **Commands** مستقلة لكل خطوة في الـ AI Flow الرئيسي.

## 📁 الملفات

### 1. **categorize-topic.ts**
- **الوظيفة**: تصنيف موضوع أو عدة مواضيع إلى فئات محددة
- **المدخلات**: 
  ```typescript
  {
    topics: string[]
  }
  ```
- **المخرجات**:
  ```typescript
  {
    categoryMap: Record<string, string>
  }
  ```
- **مثال استخدام**:
  ```typescript
  import { categorizeTopic } from '@/ai/commands';
  
  const result = await categorizeTopic({
    topics: ['GPT-5 Release', 'New React Framework']
  });
  
  console.log(result.categoryMap);
  // { 'GPT-5 Release': 'AI News', 'New React Framework': 'Web Dev' }
  ```

---

### 2. **generate-article-command.ts**
- **الوظيفة**: توليد محتوى مقال كامل من outline
- **المدخلات**:
  ```typescript
  {
    topic: string;
    outline: string;
  }
  ```
- **المخرجات**:
  ```typescript
  {
    title: string;
    content: string; // HTML format
  }
  ```
- **مثال استخدام**:
  ```typescript
  import { generateArticleCommand } from '@/ai/commands';
  
  const result = await generateArticleCommand({
    topic: 'Introduction to AI',
    outline: '1. What is AI\n2. Types of AI\n3. Future of AI'
  });
  
  console.log(result.title);
  console.log(result.content);
  ```

---

### 3. **check-quality-command.ts**
- **الوظيفة**: فحص جودة المقال وإعطاء توصيات
- **المدخلات**:
  ```typescript
  {
    content: string;
    keywords: string;
  }
  ```
- **المخرجات**:
  ```typescript
  {
    readabilityScore: number; // 0-100
    keywordDensity: number;   // percentage
    suggestions: string[];
  }
  ```
- **مثال استخدام**:
  ```typescript
  import { checkQualityCommand } from '@/ai/commands';
  
  const result = await checkQualityCommand({
    content: '<h2>Introduction</h2><p>AI is...</p>',
    keywords: 'AI, Machine Learning'
  });
  
  console.log(`Readability: ${result.readabilityScore}/100`);
  console.log(`Keyword Density: ${result.keywordDensity}%`);
  console.log('Suggestions:', result.suggestions);
  ```

---

## 🎯 الفرق بين Commands و Flows

| **Commands** | **Flows** |
|-------------|----------|
| ✅ سهلة الاستخدام | ⚙️ معقدة أكثر |
| ✅ واجهة بسيطة | ⚙️ تحتاج فهم Genkit |
| ✅ مناسبة للـ API Routes | ⚙️ مناسبة للتكامل الداخلي |
| ✅ Logging مدمج | ⚙️ تحتاج إضافة logging |

---

## 📊 متى تستخدم Commands؟

استخدم الـ **Commands** عندما:
- 🔹 تريد استدعاء خطوة واحدة فقط من الـ Flow
- 🔹 تريد بناء API endpoint مخصص
- 🔹 تريد اختبار خطوة معينة بشكل منفصل
- 🔹 تريد دمج الـ AI في Server Actions

---

## 🔄 العلاقة مع الـ Flow الرئيسي

الـ Flow الرئيسي `generate-and-process-article.ts` يستخدم:
1. ❌ **لا يستخدم** `generate-article-outlines` (خطوة أولى)
2. ✅ `categorize-topic` → Step 1
3. ✅ `generate-article-command` → Step 3
4. ✅ `check-quality-command` → Step 4

---

## 📝 ملاحظات

- كل الـ Commands تستخدم `'use server'` directive
- كل الـ Commands تحتوي على logging للمراقبة
- كل الـ Commands تستخدم نفس نظام الـ API Key Rotation
- كل الـ Commands آمنة للاستخدام في Server Actions و API Routes

---

**آخر تحديث**: 2025-11-28
