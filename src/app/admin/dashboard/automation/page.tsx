'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function AutomationPage() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [cronStatus, setCronStatus] = useState<any>(null);
    const [loadingStatus, setLoadingStatus] = useState(false);

    const handleManualGeneration = async () => {
        setIsGenerating(true);
        setResult(null);

        try {
            const response = await fetch('/api/automation/generate', {
                method: 'POST',
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Error:', error);
            setResult({
                success: false,
                error: 'Failed to generate content',
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGetStatus = async () => {
        setLoadingStatus(true);

        try {
            const response = await fetch('/api/automation/status');
            const data = await response.json();
            setCronStatus(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoadingStatus(false);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Content Automation</h1>
                <p className="text-muted-foreground">
                    Automated content generation system - Runs 6 times daily (every 4 hours)
                </p>
            </div>

            {/* Manual Generation */}
            <Card>
                <CardHeader>
                    <CardTitle>Manual Content Generation</CardTitle>
                    <CardDescription>
                        Trigger content generation manually for testing or immediate needs
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        onClick={handleManualGeneration}
                        disabled={isGenerating}
                        size="lg"
                        className="w-full sm:w-auto"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating Article...
                            </>
                        ) : (
                            <>
                                <Play className="mr-2 h-4 w-4" />
                                Generate Article Now
                            </>
                        )}
                    </Button>

                    {result && (
                        <div className={`p-4 rounded-lg border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <div className="flex items-start gap-2">
                                {result.success ? (
                                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                                )}
                                <div className="flex-1">
                                    <h3 className="font-semibold mb-2">
                                        {result.success ? 'Success!' : 'Failed'}
                                    </h3>
                                    {result.success && (
                                        <div className="space-y-1 text-sm">
                                            <p>Articles Generated: {result.articlesGenerated}</p>
                                            <p className="text-muted-foreground">
                                                Check the Posts page to review and publish the new article
                                            </p>
                                        </div>
                                    )}
                                    {result.errors && result.errors.length > 0 && (
                                        <div className="mt-2">
                                            <p className="text-sm font-medium text-red-600">Errors:</p>
                                            <ul className="list-disc list-inside text-sm text-red-600">
                                                {result.errors.map((error: string, i: number) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Cron Status */}
            <Card>
                <CardHeader>
                    <CardTitle>Automation Status</CardTitle>
                    <CardDescription>
                        View the status of automated content generation jobs
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        onClick={handleGetStatus}
                        disabled={loadingStatus}
                        variant="outline"
                        className="w-full sm:w-auto"
                    >
                        {loadingStatus ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Refresh Status
                            </>
                        )}
                    </Button>

                    {cronStatus && (
                        <div className="space-y-4">
                            <div className="text-sm text-muted-foreground">
                                Current Time: {new Date(cronStatus.currentTime).toLocaleString()}
                            </div>

                            {/* Content Generation Job */}
                            <div className="border rounded-lg p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold">Content Generation</h4>
                                    <Badge variant="secondary">
                                        <Clock className="mr-1 h-3 w-3" />
                                        Every 4 hours
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Last Run:</span>{' '}
                                        <span className="font-medium">
                                            {cronStatus.jobs?.contentGeneration?.lastRun !== 'Never'
                                                ? new Date(cronStatus.jobs.contentGeneration.lastRun).toLocaleString()
                                                : 'Never'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Next Run:</span>{' '}
                                        <span className="font-medium">
                                            {cronStatus.jobs?.contentGeneration?.nextRun !== 'Ready to run'
                                                ? new Date(cronStatus.jobs.contentGeneration.nextRun).toLocaleString()
                                                : 'Ready to run'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* API Key Reset Job */}
                            <div className="border rounded-lg p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold">API Key Reset</h4>
                                    <Badge variant="secondary">
                                        <Clock className="mr-1 h-3 w-3" />
                                        Daily
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Last Run:</span>{' '}
                                        <span className="font-medium">
                                            {cronStatus.jobs?.apiKeyReset?.lastRun !== 'Never'
                                                ? new Date(cronStatus.jobs.apiKeyReset.lastRun).toLocaleString()
                                                : 'Never'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Next Run:</span>{' '}
                                        <span className="font-medium">
                                            {cronStatus.jobs?.apiKeyReset?.nextRun !== 'Ready to run'
                                                ? new Date(cronStatus.jobs.apiKeyReset.nextRun).toLocaleString()
                                                : 'Ready to run'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Schedule Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Automation Schedule</CardTitle>
                    <CardDescription>
                        Content is automatically generated 6 times daily
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                        {['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'].map((time) => (
                            <div key={time} className="border rounded-lg p-3 text-center">
                                <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                                <div className="font-mono text-sm font-semibold">{time}</div>
                                <div className="text-xs text-muted-foreground">UTC</div>
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                        Each run generates one high-quality article based on trending topics in AI and Technology.
                        Articles are saved as drafts for your review before publishing.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
