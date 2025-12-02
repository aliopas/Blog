'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock } from 'lucide-react';

export default function AutomationPage() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Content Automation</h1>
                <p className="text-muted-foreground">
                    Automated content generation system - Runs 6 times daily (every 4 hours)
                </p>
            </div>

            {/* Disabled Notice */}
            <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-500">
                        <AlertCircle className="h-5 w-5" />
                        AI Automation Disabled
                    </CardTitle>
                    <CardDescription>
                        Automated content generation is currently disabled
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        When enabled, this system automatically generates high-quality articles 6 times per day
                        based on trending topics in AI and Technology. All generated content is saved as drafts
                        for manual review before publishing.
                    </p>
                </CardContent>
            </Card>

            {/* Schedule Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Automation Schedule</CardTitle>
                    <CardDescription>
                        Content would be automatically generated 6 times daily at these times
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                        {['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'].map((time) => (
                            <div key={time} className="border rounded-lg p-3 text-center opacity-50">
                                <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                                <div className="font-mono text-sm font-semibold">{time}</div>
                                <div className="text-xs text-muted-foreground">UTC</div>
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                        Each run would generate one high-quality article based on trending topics in AI and Technology.
                        Articles would be saved as drafts for your review before publishing.
                    </p>
                </CardContent>
            </Card>

            {/* Features Overview */}
            <Card>
                <CardHeader>
                    <CardTitle>Automation Features</CardTitle>
                    <CardDescription>
                        What this system does when enabled
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <Badge variant="outline" className="mt-0.5">1</Badge>
                            <div>
                                <h4 className="font-semibold text-sm">Topic Research</h4>
                                <p className="text-sm text-muted-foreground">
                                    Analyzes trending topics and identifies content opportunities
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Badge variant="outline" className="mt-0.5">2</Badge>
                            <div>
                                <h4 className="font-semibold text-sm">Content Generation</h4>
                                <p className="text-sm text-muted-foreground">
                                    Creates well-structured articles with proper formatting and SEO optimization
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Badge variant="outline" className="mt-0.5">3</Badge>
                            <div>
                                <h4 className="font-semibold text-sm">Quality Check</h4>
                                <p className="text-sm text-muted-foreground">
                                    Validates content quality, readability, and keyword optimization
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Badge variant="outline" className="mt-0.5">4</Badge>
                            <div>
                                <h4 className="font-semibold text-sm">Draft Creation</h4>
                                <p className="text-sm text-muted-foreground">
                                    Saves articles as drafts for manual review and editing before publication
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
