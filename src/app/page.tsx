
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { CategoriesBar } from '@/components/home/CategoriesBar';
import { FeaturedPost } from '@/components/home/FeaturedPost';
import { PostGrid } from '@/components/home/PostGrid';
import { Sidebar } from '@/components/home/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getCategories, getPosts } from '@/lib/data';
import type { Post, Category } from '@/lib/types';


async function getPageData() {
  try {
    const allPosts = await getPosts('published');
    const categories = await getCategories();

    const featuredPost = allPosts.find(p => p.isFeatured) ?? allPosts[0] ?? null;
    const latestPosts = allPosts.filter(p => p.id !== featuredPost?.id).slice(0, 6);
    const trendingPosts = [...allPosts].sort(() => 0.5 - Math.random()).slice(0, 4);

    return { posts: allPosts, categories, featuredPost, latestPosts, trendingPosts };

  } catch (e: any) {
    console.error("Failed to fetch page data:", e);
    // Return empty data on error to prevent the page from crashing.
    return { posts: [], categories: [], featuredPost: null, latestPosts: [], trendingPosts: [] };
  }
}


export default async function Home() {
  const { categories, featuredPost, latestPosts, trendingPosts } = await getPageData();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <CategoriesBar categories={categories} />

        <section className="container mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
          {featuredPost && (
            <FeaturedPost post={featuredPost} />
          )}
        </section>

        <section className="container mx-auto mt-12 max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 sm:pb-16 lg:pb-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h2 id="latest-posts" className="scroll-mt-20 text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline mb-8">
                Latest Posts
              </h2>
              {latestPosts.length > 0 ? (
                <PostGrid posts={latestPosts} />
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">No posts found. Publish some articles from the admin dashboard to see them here.</p>
                  </CardContent>
                </Card>
              )}
              <div className="mt-12 flex justify-center">
                <Button variant="outline" size="lg" asChild>
                  <Link href="/posts">Browse All Posts</Link>
                </Button>
              </div>
            </div>
            <aside className="hidden lg:block lg:col-span-4">
              <Sidebar posts={trendingPosts} categories={categories} />
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
