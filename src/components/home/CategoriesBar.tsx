'use client';

import type { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Cpu, Code, Globe, Server, Shield, Rocket } from 'lucide-react';
import React from 'react';
import Link from 'next/link';

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'AI News': Cpu,
  'Open Source': Code,
  'Web Dev': Globe,
  'DevOps': Server,
  'Cybersecurity': Shield,
  'Tutorials': Rocket,
};

type CategoriesBarProps = {
  categories: Category[];
};

export function CategoriesBar({ categories }: CategoriesBarProps) {
  return (
    <div className="sticky top-14 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center overflow-x-auto py-3">
          <div className="flex space-x-4">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/posts">All</Link>
            </Button>
            {categories.map((category) => {
              const Icon = categoryIcons[category.name];
              return (
                <Button key={category.id} variant="ghost" size="sm" className="flex items-center gap-2" asChild>
                  <Link href={`/category/${category.slug}`}>
                    {Icon && <Icon className="h-4 w-4" />}
                    {category.name}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}