'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { updatePost, deletePost, addPost } from '@/lib/data';
import { cookies } from 'next/headers';

export async function login(formData: FormData) {
    let email = formData.get('email') as string;
    const password = formData.get('password') as string;


    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const cookieStore = await cookies();
        cookieStore.set('admin_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });
        redirect('/admin/dashboard');
    } else {
        redirect('/admin?error=Invalid credentials');
    }
}

export async function createPost(formData: FormData) {
    const postData = {
        title: formData.get('title') as string,
        content: formData.get('content') as string,
        imageUrl: formData.get('imageUrl') as string,
        topic: formData.get('topic') as string,
        status: 'draft', // Default to draft
    };
    const categoryName = formData.get('category') as string;

    try {
        await addPost(postData, null, categoryName);
    } catch (error) {
        console.error("Failed to create post:", error);
        // Optional: redirect with an error message
        return redirect('/admin/dashboard/add?error=true');
    }

    revalidatePath('/admin/dashboard');
    redirect('/admin/dashboard');
}


export async function publishPost(postId: string) {
    if (!postId) return;
    try {
        await updatePost(postId, { status: 'published' });
        revalidatePath('/admin/dashboard');
        revalidatePath('/');
    } catch (error) {
        console.error("Failed to publish post:", error);
        return redirect('/admin/dashboard?error=publish'); // Use specific error key
    }
    redirect('/admin/dashboard');
}

export async function rejectPost(postId: string) {
    if (!postId) return;
    try {
        await deletePost(postId);
        revalidatePath('/admin/dashboard');
        revalidatePath('/');
    } catch (error) {
        console.error("Failed to reject post:", error);
        return redirect('/admin/dashboard?error=reject');
    }
    redirect('/admin/dashboard');
}
