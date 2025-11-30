'use client';

import { useEffect, useState, useTransition, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { getPostById, getCategories } from '@/lib/data';
import { updatePostAction, deletePostAction } from '../../post-actions';
import type { PostWithQualityCheck, Category } from '@/lib/types';

const formSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    excerpt: z.string().optional(),
    content: z.string().min(20, 'Content must be at least 20 characters'),
    categoryId: z.string().min(1, 'Please select a category'),
    status: z.enum(['draft', 'published']),
    imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    imageHint: z.string().optional(),
});

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [post, setPost] = useState<PostWithQualityCheck | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            excerpt: '',
            content: '',
            categoryId: '',
            status: 'draft',
            imageUrl: '',
            imageHint: '',
        },
    });

    useEffect(() => {
        async function loadData() {
            try {
                const [fetchedPost, fetchedCategories] = await Promise.all([
                    getPostById(resolvedParams.id),
                    getCategories(),
                ]);

                if (!fetchedPost) {
                    toast({
                        variant: 'destructive',
                        title: 'Error',
                        description: 'Post not found',
                    });
                    router.push('/admin/dashboard/posts');
                    return;
                }

                setPost(fetchedPost);
                setCategories(fetchedCategories);

                form.reset({
                    title: fetchedPost.title,
                    excerpt: fetchedPost.excerpt || '',
                    content: fetchedPost.content,
                    categoryId: fetchedPost.categoryId,
                    status: fetchedPost.status as 'draft' | 'published',
                    imageUrl: fetchedPost.imageUrl || '',
                    imageHint: fetchedPost.imageHint || '',
                });
            } catch (error) {
                console.error('Failed to load data:', error);
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Failed to load post data',
                });
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, [resolvedParams.id, router, toast, form]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        startTransition(async () => {
            try {
                await updatePostAction(resolvedParams.id, values);
                toast({
                    title: 'Success',
                    description: 'Post updated successfully',
                });
                router.push('/admin/dashboard/posts');
                router.refresh();
            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Failed to update post',
                });
            }
        });
    }

    async function handleDelete() {
        try {
            await deletePostAction(resolvedParams.id);
            toast({
                title: 'Success',
                description: 'Post deleted successfully',
            });
            router.push('/admin/dashboard/posts');
            router.refresh();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to delete post',
            });
        }
    }

    if (isLoading) {
        return (
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl font-bold font-headline">Edit Post</h1>
                </div>
                <div className="flex items-center gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" disabled={isPending}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the post
                                    "{post?.title}".
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Post Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Post title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category.id} value={category.id}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="draft">Draft</SelectItem>
                                                    <SelectItem value="published">Published</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="excerpt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Excerpt</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Brief summary of the post"
                                                className="h-20 resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Appears in post previews and SEO meta tags.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content (HTML)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Post content..."
                                                className="min-h-[300px] font-mono text-sm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Supports HTML content.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Image URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="imageHint"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Image Hint (for AI generation)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., futuristic city" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
