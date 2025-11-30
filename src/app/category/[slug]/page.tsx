import { notFound } from 'next/navigation';
import type { Post, Category } from '@/lib/types';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PostGrid } from '@/components/home/PostGrid';
import { Cpu, Code, Globe, Server, Shield, Rocket } from 'lucide-react';
import React from 'react';
import { getCategories, getCategoryBySlug, getPostsByCategoryId } from '@/lib/data';


const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'AI News': Cpu,
  'Open Source': Code,
  'Web Dev': Globe,
  'DevOps': Server,
  'Cybersecurity': Shield,
  'Tutorials': Rocket,
};

export async function generateStaticParams() {
  const allCategories = await getCategories();
  return allCategories.map((category) => ({
    slug: category.slug,
  }));
}

async function getCategoryData(slug: string) {
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { category: null, posts: [] };
  }

  const categoryPostsData = await getPostsByCategoryId(category.id);

  return { category, posts: categoryPostsData };
}


export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { category, posts: categoryPosts } = await getCategoryData(slug);

  if (!category) {
    notFound();
  }

  const Icon = categoryIcons[category.name];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-4">
              {Icon && <Icon className="h-10 w-10 text-primary" />}
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl font-headline">
                {category.name}
              </h1>
            </div>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {`Browsing all posts in the "${category.name}" category.`}
            </p>
          </div>
        </section>

        <section className="container mx-auto max-w-5xl px-4 pb-12 sm:px-6 lg:px-8 sm:pb-16 lg:pb-20">
          {categoryPosts.length > 0 ? (
            <PostGrid posts={categoryPosts} />
          ) : (
            <p className="text-center text-muted-foreground">No posts found in this category yet.</p>
          )}
        </section>

      </main>
      <Footer />
    </div>
  );
}
