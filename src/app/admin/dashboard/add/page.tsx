
import {
    ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getCategories } from '@/lib/data';
import { createPost } from '../../actions';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


export default async function AddPostPage() {

    const categories = await getCategories();

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
                <div className="mx-auto grid w-full max-w-6xl gap-2">
                    <Link href="/admin/dashboard" className='flex items-center gap-2 text-muted-foreground hover:text-foreground'>
                        <ArrowLeft className="h-5 w-5" />
                        <h1 className="text-xl font-semibold">Add New Post</h1>
                    </Link>
                </div>
                <div className="mx-auto grid w-full max-w-6xl items-start gap-6">
                    <form action={createPost}>
                        <div className="grid gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Post Details</CardTitle>
                                    <CardDescription>Fill in the details of your new post.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="title">Title</Label>
                                        <Input id="title" name="title" type="text" placeholder="Enter post title" />
                                    </div>

                                    <div className="grid gap-3">
                                        <Label htmlFor="content">Content</Label>
                                        <Textarea id="content" name="content" placeholder="Write your post content here." className="min-h-[200px]" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="grid gap-3">
                                            <Label htmlFor="imageUrl">Image URL</Label>
                                            <Input id="imageUrl" name="imageUrl" type="url" placeholder="https://example.com/image.jpg" />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="topic">Topic</Label>
                                            <Input id="topic" name="topic" type="text" placeholder="e.g., AI in Healthcare" />
                                        </div>
                                    </div>

                                    <div className="grid gap-3">
                                        <Label htmlFor="category">Category</Label>
                                        <Select name="category">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.name}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button type="button" variant="outline">Cancel</Button>
                                        <Button type="submit">Save Post</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
