'use server';

interface GeolocationData {
    country: string | null;
    city: string | null;
    latitude: number | null;
    longitude: number | null;
}

export async function getGeolocationFromIP(ip: string): Promise<GeolocationData> {
    try {
        // Use ipapi.co free tier (1000 requests/day)
        const response = await fetch(`https://ipapi.co/${ip}/json/`, {
            headers: {
                'User-Agent': 'Tech Insights Blog',
            },
            next: { revalidate: 86400 }, // Cache for 24 hours
        });

        if (!response.ok) {
            console.warn(`Geolocation API error: ${response.status}`);
            return { country: null, city: null, latitude: null, longitude: null };
        }

        const data = await response.json();

        return {
            country: data.country_name || null,
            city: data.city || null,
            latitude: data.latitude ? parseFloat(data.latitude) : null,
            longitude: data.longitude ? parseFloat(data.longitude) : null,
        };
    } catch (error) {
        console.error('Failed to fetch geolocation:', error);
        return { country: null, city: null, latitude: null, longitude: null };
    }
}

// Fallback: Get IP from request headers
export function getClientIP(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    if (realIP) {
        return realIP;
    }

    // Fallback for local development
    return '127.0.0.1';
}
