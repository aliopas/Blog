import type { Post } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Cpu, Code, Globe, Server, Shield, Rocket } from 'lucide-react';
import React from 'react';

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'AI News': Cpu,
  'Open Source': Code,
  'Web Dev': Globe,
  'DevOps': Server,
  'Cybersecurity': Shield,
  'Tutorials': Rocket,
};

type FeaturedPostProps = {
  post: Post;
};

export function FeaturedPost({ post }: FeaturedPostProps) {
  const Icon = categoryIcons[post.category.name];
  return (
    <div className="group relative overflow-hidden rounded-lg bg-card shadow-lg transition-shadow duration-300 hover:shadow-primary/20">
      <Link href={`/posts/${post.slug}`} className="block">
        <div className="grid md:grid-cols-2">
          <div className="relative h-64 md:h-auto">
            <Image
              src={post.imageUrl || '/placeholder-post.jpg'}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={post.imageHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent md:bg-gradient-to-r"></div>
          </div>
          <div className="relative flex flex-col p-8">
            <Badge variant="default" className="absolute top-8 right-8 bg-accent text-accent-foreground">Featured</Badge>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {Icon && <Icon className="h-4 w-4" />}
              <span>{post.category.name}</span>
            </div>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground font-headline group-hover:text-primary transition-colors duration-300">
              {post.title}
            </h2>
            <p className="mt-4 text-base text-muted-foreground line-clamp-3">
              {post.excerpt}
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
              <span>{post.publishedAt}</span>
              <span>&middot;</span>
              <span>{post.readTime} min read</span>
            </div>
            <div className="mt-auto pt-6">
              <div className="flex items-center text-primary font-semibold">
                Read More <ArrowUpRight className="ml-1 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
