import type { Post, Category } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Cpu, Code, Globe, Server, Shield, Rocket } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'AI News': Cpu,
  'Open Source': Code,
  'Web Dev': Globe,
  'DevOps': Server,
  'Cybersecurity': Shield,
  'Tutorials': Rocket,
};


type SidebarProps = {
  posts: Post[];
  categories: Category[];
};

export function Sidebar({ posts, categories }: SidebarProps) {
  return (
    <div className="sticky top-28 space-y-8">
      <div>
        <h3 className="text-lg font-semibold tracking-tight font-headline mb-4">Search</h3>
        <div className="relative">
          <Input placeholder="Search posts..." className="pr-10" />
          <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold tracking-tight font-headline mb-4">Trending Posts</h3>
        <div className="space-y-4">
          {posts.map((post) => (
            <Link key={post.id} href={`/posts/${post.slug}`} className="group block">
              <p className="font-medium text-foreground group-hover:text-primary transition-colors">{post.title}</p>
              <p className="text-sm text-muted-foreground">{post.publishedAt}</p>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold tracking-tight font-headline mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => {
            const Icon = categoryIcons[category.name];
            return (
              <Link key={category.id} href={`/category/${category.slug}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                {Icon && <Icon className="h-4 w-4" />}
                <span>{category.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
