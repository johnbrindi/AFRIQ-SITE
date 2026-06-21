import { unstable_cache } from 'next/cache';
import { prisma } from './db';

export const getCachedUniversities = unstable_cache(
    async () => {
        return await prisma.university.findMany({
            include: {
                schools: true,
            },
            orderBy: {
                id: 'asc',
            },
        });
    },
    ['universities-list'],
    { revalidate: 3600, tags: ['universities'] } // Cache for 1 hour, tag for on-demand revalidation
);
