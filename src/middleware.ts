import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const adminSession = request.cookies.get('admin_session');
    const pathname = request.nextUrl.pathname;

    // Track visitor (skip admin routes and static files)
    if (!pathname.startsWith('/admin') &&
        !pathname.startsWith('/_next') &&
        !pathname.startsWith('/api') &&
        !pathname.includes('.')) {

        // Run tracking in background (don't await)
        trackVisitorInBackground(request).catch(err =>
            console.error('Visitor tracking error:', err)
        );
    }

    // If user is logged in and tries to access /admin login page, redirect to dashboard
    if (pathname === '/admin' && adminSession) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // Protect admin dashboard routes
    if (pathname.startsWith('/admin/dashboard')) {
        if (!adminSession) {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
    }

    return NextResponse.next();
}

async function trackVisitorInBackground(request: NextRequest) {
    try {
        const { getClientIP, getGeolocationFromIP } = await import('./lib/geolocation');

        const ip = getClientIP(request);
        const userAgent = request.headers.get('user-agent');
        const pathname = request.nextUrl.pathname;

        // Get geolocation
        const geo = await getGeolocationFromIP(ip);

        // Check if it's a post page
        let postId: number | null = null;
        // const postMatch = pathname.match(/^\/posts\/([^\/]+)$/);

        // Prepare data
        const trackingData = {
            ipAddress: ip,
            country: geo.country,
            city: geo.city,
            latitude: geo.latitude,
            longitude: geo.longitude,
            userAgent,
            pageVisited: pathname,
            postId,
        };

        // Send to API (fire and forget)
        // We use the full URL because fetch in middleware needs absolute URL
        const url = request.nextUrl.clone();
        url.pathname = '/api/track';

        fetch(url.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(trackingData),
        }).catch(err => console.error('Tracking fetch error:', err));

    } catch (error) {
        // Silently fail - don't break the request
        console.error('Background tracking failed:', error);
    }
}

export const config = {
    matcher: ['/admin', '/admin/dashboard/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
};
