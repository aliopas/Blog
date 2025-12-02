'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function GeneratePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">AI Content Generation</h1>
        <p className="text-muted-foreground">
          Generate high-quality articles using AI technology
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            AI Features Disabled
          </CardTitle>
          <CardDescription>
            AI content generation is currently disabled
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This feature allows you to generate articles automatically using AI.
              The system can create well-structured, SEO-optimized content based on trending topics.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Features (when enabled):</h3>
              <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                <li>Automatic topic research and trending analysis</li>
                <li>High-quality article generation with proper structure</li>
                <li>SEO optimization and keyword integration</li>
                <li>Quality checking and readability scoring</li>
                <li>Draft creation for manual review before publishing</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}