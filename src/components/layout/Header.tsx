import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Bot } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Bot className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              Tech Insights Daily
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/posts"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Posts
            </Link>
            <Link
              href="/categories"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Categories
            </Link>
          </nav>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
             <Link href="/" className="mr-6 flex items-center space-x-2">
                <Bot className="h-6 w-6 text-primary" />
                <span className="font-bold sm:inline-block font-headline">
                  Tech Insights Daily
                </span>
              </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                <Link href="/posts" className="text-foreground">
                  Posts
                </Link>
                <Link href="/categories" className="text-foreground/60">
                  Categories
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* Admin Login Button Removed */}
        </div>
      </div>
    </header>
  );
}
