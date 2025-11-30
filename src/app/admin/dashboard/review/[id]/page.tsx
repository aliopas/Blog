
'use client';

import {
    ArrowLeft,
    CheckCircle,
    Sparkles,
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState, use } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getPostForReview } from '../../../queries';
import type { PostWithQualityCheck } from '@/lib/types'; 
import { publishPost, rejectPost } from '../../../actions';
import { format } from 'date-fns';
import { useFormStatus } from 'react-dom';

function ActionButtons({ postId }: { postId: string | null }) {
    const { pending } = useFormStatus();

    return (
        <div className="space-y-4">
            <form action={() => publishPost(postId!)}>
                <Button type="submit" className="w-full" disabled={pending || !postId}>
                    {pending ? "Publishing..." : "Publish"}
                </Button>
            </form>
            <Button variant="outline" className="w-full" disabled={pending}>Save Draft</Button>
            <form action={() => rejectPost(postId!)}>
                <Button variant="destructive" type="submit" className="w-full" disabled={pending || !postId}>
                    {pending ? "Rejecting..." : "Reject"}
                </Button>
            </form>
        </div>
    );
}


export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [post, setPost] = useState<PostWithQualityCheck | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!resolvedParams.id) return;
            setIsLoading(true);
            try {
                const fetchedPost = await getPostForReview(resolvedParams.id);
                setPost(fetchedPost);
            } catch (error) {
                console.error("Failed to fetch article for review:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [resolvedParams.id]);

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
                <div className="mx-auto grid w-full max-w-6xl gap-2">
                    <Link href="/admin/dashboard" className='flex items-center gap-2 text-muted-foreground hover:text-foreground'>
                        <ArrowLeft className="h-5 w-5" />
                        <h1 className="text-xl font-semibold">Review Post</h1>
                    </Link>
                </div>
                <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[1fr_250px] lg:grid-cols-[1fr_300px]">
                    <div className="grid gap-6">
                        {isLoading || !post ? (
                            <Card>
                                <CardHeader>
                                    <Skeleton className="h-8 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </CardHeader>
                                <CardContent className='space-y-4'>
                                    <Skeleton className="h-48 w-full" />
                                    <Skeleton className="h-24 w-full" />
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle>{post.title}</CardTitle>
                                    <CardDescription>
                                        Topic: {post.topic} &middot; Generated: {post.qualityCheck ? format(new Date(post.qualityCheck.checkedAt), 'MMM d, yyyy') : ''}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div
                                        className="prose prose-invert prose-lg mx-auto prose-headings:font-headline prose-a:text-primary hover:prose-a:text-primary/80 prose-code:font-code prose-code:bg-card prose-code:p-1 prose-code:rounded-sm"
                                        dangerouslySetInnerHTML={{ __html: post.content }}
                                    />
                                </CardContent>
                            </Card>
                        )}
                    </div>
                    <div className="grid gap-6">
                        <Card className="overflow-hidden">
                            <CardHeader>
                                <CardTitle>Actions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                 <ActionButtons postId={post?.id || null} />
                            </CardContent>
                        </Card>

                        {isLoading || !post || !post.qualityCheck ? (
                            <Card>
                                <CardHeader>
                                    <Skeleton className="h-6 w-1/2" />
                                </CardHeader>
                                <CardContent className='space-y-4'>
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-16 w-full" />
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quality Check</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span>Readability Score:</span>
                                        <span className='font-semibold'>{post.qualityCheck.readabilityScore.toFixed(0)}</span>
                                    </div>
                                    <Progress value={post.qualityCheck.readabilityScore} />

                                    <div className="flex items-center justify-between">
                                        <span>Keyword Density:</span>
                                        <span className='font-semibold'>{post.qualityCheck.keywordDensityScore.toFixed(0)}</span>
                                    </div>
                                    <Progress value={post.qualityCheck.keywordDensityScore} />

                                    <div className='space-y-2'>
                                        <h4 className='font-semibold'>Suggestions:</h4>
                                        <p className='text-muted-foreground'>{post.qualityCheck.suggestions}</p>
                                    </div>

                                    <div className="flex justify-center pt-2">
                                        {post.qualityCheck.isHighQuality ? (
                                            <Badge variant="default" className='gap-2'>
                                                <CheckCircle className="h-4 w-4" />
                                                High Quality
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className='gap-2'>
                                                Needs Manual Review
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle>Enhancements</CardTitle>
                                <CardDescription>AI-powered improvements for your article.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" className='w-full gap-2'>
                                    <Sparkles className='h-4 w-4' />
                                    Suggest Quotes & Takeaways
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
