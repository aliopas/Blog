import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getPosts, getPostBySlug } from '@/lib/data';
import type { Post } from '@/lib/types';


export async function generateStaticParams() {
  const allPosts = await getPosts('published');
  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <article>
          <header className="relative py-16 sm:py-24 lg:py-32">
            <div className="absolute inset-0">
              {post.imageUrl && (
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  data-ai-hint={post.imageHint || ''}
                />
              )}
              <div className="absolute inset-0 bg-black/60" />
            </div>
            <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
              <Badge variant="secondary" className="mb-4">
                {post.category.name}
              </Badge>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl font-headline">
                {post.title}
              </h1>
              <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime} min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span>AI Author</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-sans">{post.publishedAt}</span>
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
            <div
              className="prose prose-invert prose-lg mx-auto prose-headings:font-headline prose-a:text-primary hover:prose-a:text-primary/80 prose-code:font-code prose-code:bg-card prose-code:p-1 prose-code:rounded-sm"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
