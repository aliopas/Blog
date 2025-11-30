import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { Category } from '@/lib/types';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Cpu, Code, Globe, Server, Shield, Rocket } from 'lucide-react';
import React from 'react';
import { getCategories as getAllCategories } from '@/lib/data';

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'AI News': Cpu,
  'Open Source': Code,
  'Web Dev': Globe,
  'DevOps': Server,
  'Cybersecurity': Shield,
  'Tutorials': Rocket,
};

function CategoryCard({ category }: { category: Category }) {
    const Icon = categoryIcons[category.name];
    return (
        <Link href={`/category/${category.slug}`}>
            <Card className="group flex h-full transform-gpu flex-col justify-between overflow-hidden
                           bg-card text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        {Icon && <Icon className="h-8 w-8 text-primary" />}
                        <CardTitle className="font-headline text-xl group-hover:text-primary">{category.name}</CardTitle>
                    </div>
                </CardHeader>
                <div className="flex items-center justify-end p-4 text-sm font-semibold text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    View Posts <ArrowRight className="ml-2 h-4 w-4" />
                </div>
            </Card>
        </Link>
    )
}

export default async function CategoriesPage() {
  const categories = await getAllCategories();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl font-headline">
              Categories
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Explore posts across all our technology categories.
            </p>
          </div>
        </section>
        
        <section className="container mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 sm:pb-16 lg:pb-20">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
