'use server';

import { revalidatePath } from 'next/cache';
import { updatePost, deletePost } from '@/lib/data';

export async function updatePostAction(id: string, data: any) {
    try {
        await updatePost(id, data);
        revalidatePath('/admin/dashboard/posts');
        revalidatePath(`/posts/${data.slug}`); // Assuming slug might be in data or we'd need to fetch it
        revalidatePath('/');
    } catch (error) {
        console.error('Failed to update post:', error);
        throw new Error('Failed to update post');
    }
}

export async function deletePostAction(id: string) {
    try {
        await deletePost(id);
        revalidatePath('/admin/dashboard/posts');
        revalidatePath('/');
    } catch (error) {
        console.error('Failed to delete post:', error);
        throw new Error('Failed to delete post');
    }
}
