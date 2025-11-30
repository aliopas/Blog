
'use client';

import {
  FileText,
  Clock,
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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getPosts } from '@/lib/data';
import type { PostWithQualityCheck } from '@/lib/types';
import { format } from 'date-fns';


export default function Dashboard() {
  const [pendingPosts, setPendingPosts] = useState<PostWithQualityCheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const posts = await getPosts('draft');
        setPendingPosts(posts as PostWithQualityCheck[]); // Cast since getPosts doesn't return qualityCheck
      } catch (error) {
        console.error("Failed to fetch pending posts:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
        <div className="ml-auto">
            <Link href="/admin/dashboard/generate">
                <Button>Generate New Post</Button>
            </Link>
        </div>
        </div>
        <div className="grid gap-4 md:gap-8">
        <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
                <CardTitle>Pending Posts</CardTitle>
                <CardDescription>
                Review and approve AI-generated articles that are currently in draft.
                </CardDescription>
            </div>
             <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/admin/dashboard/posts">
                    View All
                    <FileText className="h-4 w-4" />
                </Link>
            </Button>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className='hidden md:table-cell'>Status</TableHead>
                    <TableHead className='hidden md:table-cell'>Generated</TableHead>
                    <TableHead className='text-right'>
                        Actions
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {isLoading ? (
                    [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                        <TableCell className='hidden md:table-cell'><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                        <TableCell className='hidden md:table-cell'><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell className='text-right'><Skeleton className="h-9 w-[88px] ml-auto" /></TableCell>
                    </TableRow>
                    ))
                ) : pendingPosts.length > 0 ? (
                    pendingPosts.map((post) => (
                    <TableRow key={post.id}>
                        <TableCell className="font-medium max-w-xs truncate">{post.title}</TableCell>
                        <TableCell className='hidden md:table-cell'>
                        <Badge variant={'secondary'}>
                            <Clock className='mr-2 h-4 w-4' />
                            {post.status}
                        </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                        {post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : 'N/A'}
                        </TableCell>
                        <TableCell className='text-right'>
                        <Link href={`/admin/dashboard/review/${post.id}`}>
                            <Button size="sm">Review & Publish</Button>
                        </Link>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                        No pending posts found. Try generating one!
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
        
        </div>
    </div>
  );
}
