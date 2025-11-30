import type { Post } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight } from 'lucide-react';

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link href={`/posts/${post.slug}`} className="block">
        {post.imageUrl && (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={post.imageHint}
            />
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex-1">
          <div className="flex items-center justify-between text-sm">
            <Badge variant="outline">{post.category.name}</Badge>
            <div className="text-muted-foreground">
              {post.readTime} min read
            </div>
          </div>
          <Link href={`/posts/${post.slug}`} className="mt-4 block">
            <p className="text-xl font-semibold text-foreground font-headline group-hover:text-primary transition-colors">
              {post.title}
            </p>
            <p className="mt-3 text-base text-muted-foreground line-clamp-2">
              {post.excerpt}
            </p>
          </Link>
        </div>
        <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
            <span>{post.publishedAt}</span>
            <div className="flex items-center text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Read More <ArrowUpRight className="ml-1 h-4 w-4" />
            </div>
        </div>
      </div>
    </div>
  );
}
