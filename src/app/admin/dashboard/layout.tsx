
'use client';

import {
  Home,
  LineChart,
  Bot,
  FileText,
  Settings,
  Menu,
  FilePlus, 
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';


const navItems = [
    { href: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/admin/dashboard/posts', icon: FileText, label: 'Posts' },
    { href: '/admin/dashboard/analytics', icon: LineChart, label: 'Analytics' },
    { href: '/admin/dashboard/generate', icon: Bot, label: 'Generate' },
    { href: '/admin/dashboard/add', icon: FilePlus, label: 'Add Post' },
    { href: '/admin/dashboard/settings', icon: Settings, label: 'Settings' },
];


function NavLink({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-muted text-primary"
            )}
        >
            <Icon className="h-4 w-4" />
            {label}
        </Link>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-card md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Bot className="h-6 w-6 text-primary" />
              <span className="font-headline">Tech Insights</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                {navItems.map(item => <NavLink key={item.href} {...item} />)}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
           <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                  <Bot className="h-6 w-6 text-primary" />
                  <span className="sr-only">Tech Insights</span>
                </Link>
                 {navItems.map(item => <NavLink key={item.href} {...item} />)}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* Can be used for page titles or search */}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href="/admin/dashboard/settings">Settings</Link></DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 bg-muted/40 lg:gap-6">
            {children}
        </main>
      </div>
    </div>
  );
}
