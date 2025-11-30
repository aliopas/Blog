
'use client';

import { BarChart, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { XAxis, YAxis, CartesianGrid, Pie, Cell, ResponsiveContainer, Bar as BarPrimitive, Pie as PiePrimitive, BarChart as RechartsBarChart, PieChart as RechartsPieChart } from 'recharts';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getPosts, getCategories } from '@/lib/data';
import type { Post, Category } from '@/lib/types';


interface AnalyticsData {
  postsPerCategory: { name: string, count: number }[];
  qualityData: { name: string, count: number, fill: string }[];
  totalPosts: number;
  totalCategories: number;
  avgReadTime: number;
}

async function getAnalyticsData(): Promise<AnalyticsData> {
  try {
    const allPosts = await getPosts('published');
    const allCategories = await getCategories();

    const postsPerCategory = allCategories.map(category => {
      const count = allPosts.filter(p => p.categoryId === category.id).length;
      return { name: category.name, count };
    });

    const qualityData = [
      { name: 'High Quality', count: allPosts.length - 1, fill: 'hsl(var(--primary))' },
      { name: 'Needs Review', count: 1, fill: 'hsl(var(--muted))' }
    ].filter(d => d.count > 0);


    const totalPosts = allPosts.length;
    const totalCategories = allCategories.length;
    const totalReadTime = allPosts.reduce((acc, post) => acc + post.readTime, 0);
    const avgReadTime = totalPosts > 0 ? Number((totalReadTime / totalPosts).toFixed(1)) : 0;

    return {
      postsPerCategory,
      qualityData,
      totalPosts,
      totalCategories,
      avgReadTime,
    };
  } catch (error) {
    console.error("Failed to fetch analytics data:", error);
    return {
      postsPerCategory: [],
      qualityData: [],
      totalPosts: 0,
      totalCategories: 0,
      avgReadTime: 0
    };
  }
}


export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const analyticsData = await getAnalyticsData();
      setData(analyticsData);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-headline">Analytics</h1>
        <p className="text-muted-foreground">Overview of your content performance.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-10 w-1/3" /> : <div className="text-4xl font-bold">{data?.totalPosts}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-10 w-1/3" /> : <div className="text-4xl font-bold">{data?.totalCategories}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg. Read Time</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-10 w-1/3" /> : (
              <div className="text-4xl font-bold">
                {data?.avgReadTime} min
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'><BarChart className='h-5 w-5' /> Posts per Category</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-[300px] w-full" /> : (
              data && data.postsPerCategory.length > 0 ? (
                <ChartContainer config={{}} className="h-[300px] w-full">
                  <ResponsiveContainer>
                    <RechartsBarChart data={data.postsPerCategory}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <BarPrimitive dataKey="count" fill="hsl(var(--primary))" radius={4} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="flex h-[300px] items-center justify-center">
                  <p className="text-muted-foreground">No data to display.</p>
                </div>
              )
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'><PieChart className='h-5 w-5' /> Article Quality</CardTitle>
            <CardDescription>Breakdown of generated article quality status.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-[250px] w-full" /> : (
              data && data.qualityData.length > 0 ? (
                <ChartContainer
                  config={{
                    count: {
                      label: "Posts",
                    },
                  }}
                  className="mx-auto aspect-square h-[250px]"
                >
                  <RechartsPieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <PiePrimitive data={data.qualityData} dataKey="count" nameKey="name" innerRadius={60}>
                      {data.qualityData.map((d) => (
                        <Cell key={d.name} fill={d.fill} />
                      ))}
                    </PiePrimitive>
                  </RechartsPieChart>
                </ChartContainer>
              ) : (
                <div className="flex h-[250px] items-center justify-center">
                  <p className="text-muted-foreground">No data to display.</p>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
