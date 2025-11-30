/**
 * 🤖 AI USAGE:
 * - generateAndProcessArticle (manual generation - button: "Generate Article")
 * - triggerContentGeneration (automated generation - button: "Generate Automated Post Now")
 * See: AI_FLOWS_TRACKING.md
 */

'use client';

import {
  Loader2,
  Clock,
  TrendingUp,
  Zap,
  Sparkles
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useState, useTransition } from 'react';
import {
  generateAndProcessArticle,
} from '@/ai/flows/generate-and-process-article';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';


export default function GeneratePage() {
  const [topic, setTopic] = useState('');
  const [isGenerating, startGenerating] = useTransition();
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Schedule configuration
  const [schedules, setSchedules] = useState<string[]>([
    "00:00", "04:00", "08:00", "12:00", "16:00", "20:00"
  ]);

  // Quality thresholds
  const [minReadability, setMinReadability] = useState(70);
  const [minKeywordDensity, setMinKeywordDensity] = useState(70);

  const handleGenerate = async () => {
    // 🤖 AI DISABLED
    toast({ variant: 'destructive', title: "AI Disabled" });

    // if (!topic.trim()) {
    //   toast({
    //     variant: 'destructive',
    //     title: "Topic is required",
    //     description: "Please enter a topic to generate an article.",
    //   });
    //   return;
    // }

    // startGenerating(async () => {
    //   try {
    //     const result = await generateAndProcessArticle({ topic });
    //     toast({
    //       title: "Success!",
    //       description: "Article generated. Redirecting to review page...",
    //     });
    //     router.push(`/admin/dashboard/review/${result.postId}`);
    //   } catch (error) {
    //     console.error("Failed to generate article:", error);
    //     toast({
    //       variant: 'destructive',
    //       title: "Generation Failed",
    //       description: "Could not generate the article. Please check the console for more details.",
    //     });
    //   }
    // });
  };

  // Handler for automated generation (discovers trending topics automatically)
  const handleAutomatedGenerate = async () => {
    // 🤖 AI DISABLED
    toast({ variant: 'destructive', title: "AI Disabled" });

    // setIsAutoGenerating(true);
    // try {
    //   const response = await fetch('/api/automation/generate', {
    //     method: 'POST',
    //   });
    //   const result = await response.json();

    //   if (result.success && result.articlesGenerated > 0) {
    //     toast({
    //       title: "Success!",
    //       description: `Generated ${result.articlesGenerated} article(s). Check the Posts page to review.`,
    //     });
    //   } else {
    //     toast({
    //       variant: 'destructive',
    //       title: "Generation Failed",
    //       description: result.errors?.join(', ') || result.error || "Could not generate article.",
    //     });
    //   }
    // } catch (error) {
    //   console.error("Failed automated generation:", error);
    //   toast({
    //     variant: 'destructive',
    //     title: "Generation Failed",
    //     description: "Could not complete automated generation. Check console for details.",
    //   });
    // } finally {
    //   setIsAutoGenerating(false);
    // }
  };

  const handleSaveSchedule = async () => {
    toast({
      title: "Schedule Saved",
      description: "Automation schedule has been updated successfully.",
    });
    // TODO: Integrate with updateSchedule from automation-config.ts
  };

  const handleSaveQualityThresholds = async () => {
    toast({
      title: "Quality Thresholds Saved",
      description: "Quality score requirements have been updated.",
    });
    // TODO: Integrate with updateQualityThresholds from automation-config.ts
  };


  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Generate New Post</h1>
          <p className="text-muted-foreground">
            Use our powerful AI to generate a high-quality blog post from a single topic, or configure automation settings.
          </p>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6">
          {/* Automated Generation Card - NEW! */}
          <Card className="border-primary/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>Generate Automated Post Now</CardTitle>
              </div>
              <CardDescription>
                AI will automatically discover trending topics and generate a complete article (just like scheduled automation, but on-demand).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleAutomatedGenerate}
                disabled={isAutoGenerating || isGenerating}
                size="lg"
                className="w-full"
              >
                {isAutoGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Discovering topics and generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Automated Post Now
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Manual Generation Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle>Generate Article From Topic</CardTitle>
              </div>
              <CardDescription>
                Enter a specific topic, keyword, or trending news headline. The AI will handle the rest.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Textarea
                  placeholder="e.g., 'The Impact of GPT-4 on Open Source Development'"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="min-h-[120px] text-lg"
                  disabled={isGenerating || isAutoGenerating}
                />
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || isAutoGenerating}
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Generate Article
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Configuration Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <CardTitle>Automation Schedule</CardTitle>
              </div>
              <CardDescription>
                Set the times when articles should be automatically generated (6 times daily)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {schedules.map((schedule, index) => (
                    <div key={index} className="grid gap-2">
                      <Label htmlFor={`schedule-${index}`}>Time {index + 1}</Label>
                      <Input
                        id={`schedule-${index}`}
                        type="time"
                        value={schedule}
                        onChange={(e) => {
                          const newSchedules = [...schedules];
                          newSchedules[index] = e.target.value;
                          setSchedules(newSchedules);
                        }}
                      />
                    </div>
                  ))}
                </div>
                <Button onClick={handleSaveSchedule} variant="secondary">
                  <Clock className="mr-2 h-4 w-4" />
                  Save Schedule
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quality Thresholds Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle>Quality Thresholds</CardTitle>
              </div>
              <CardDescription>
                Set minimum quality scores for automatically generated articles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="readability">Minimum Readability Score (0-100)</Label>
                  <Input
                    id="readability"
                    type="number"
                    min="0"
                    max="100"
                    value={minReadability}
                    onChange={(e) => setMinReadability(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="keyword-density">Minimum Keyword Density Score (0-100)</Label>
                  <Input
                    id="keyword-density"
                    type="number"
                    min="0"
                    max="100"
                    value={minKeywordDensity}
                    onChange={(e) => setMinKeywordDensity(parseInt(e.target.value) || 0)}
                  />
                </div>
                <Button onClick={handleSaveQualityThresholds} variant="secondary">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Save Quality Thresholds
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
