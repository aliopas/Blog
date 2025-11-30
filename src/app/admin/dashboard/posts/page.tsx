
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getPosts } from '@/lib/data';
import type { Post } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { FileText, Pencil } from 'lucide-react';

async function getAllPosts(): Promise<Post[]> {
  // Fetch all posts, regardless of status
  return await getPosts();
}

export default function AllPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const allPosts = await getAllPosts();
        // Sort posts to show drafts first, then by date
        allPosts.sort((a, b) => {
          if (a.status === 'draft' && b.status !== 'draft') return -1;
          if (a.status !== 'draft' && b.status === 'draft') return 1;
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        });
        setPosts(allPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <FileText className='h-6 w-6' />
          Manage Posts
        </h1>
        <p className="text-muted-foreground">View, edit, and manage all your posts.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
          <CardDescription>
            A list of all articles, including published and draft versions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-28" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-9 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium max-w-[300px] truncate">{post.title}</TableCell>
                    <TableCell className="hidden md:table-cell">{post.category.name}</TableCell>
                    <TableCell>
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{post.publishedAt}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/dashboard/posts/edit/${post.id}`}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No posts found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
