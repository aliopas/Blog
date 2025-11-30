import type { Post } from '@/lib/types';
import { PostCard } from './PostCard';

type PostGridProps = {
  posts: Post[];
};

export function PostGrid({ posts }: PostGridProps) {
  return (
    <div id="latest-posts" className="grid gap-8 sm:grid-cols-2">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
