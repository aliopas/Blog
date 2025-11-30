import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PostGrid } from '@/components/home/PostGrid';
import { CategoriesBar } from '@/components/home/CategoriesBar';
import { getPosts, getCategories } from '@/lib/data';
import type { Post, Category } from '@/lib/types';


async function getAllPosts() {
    const allPostsData = await getPosts('published');
    const categories = await getCategories();
    return { posts: allPostsData, categories };
}

export default async function AllPostsPage() {
  const { posts, categories } = await getAllPosts();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl font-headline">
              All Posts
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Browse through our collection of articles and tutorials.
            </p>
          </div>
        </section>
        
        <CategoriesBar categories={categories} />

        <section className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 sm:py-16 lg:py-20">
          <PostGrid posts={posts} />
        </section>

      </main>
      <Footer />
    </div>
  );
}
