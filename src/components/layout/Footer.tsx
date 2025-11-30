import Link from 'next/link';
import { Bot, Twitter, Github, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border/40">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline">Tech Insights Daily</span>
          </div>
          <p className="text-center text-sm text-foreground/60">
            © {new Date().getFullYear()} Tech Insights Daily. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Link href="#" className="text-foreground/60 hover:text-foreground">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-foreground/60 hover:text-foreground">
              <span className="sr-only">GitHub</span>
              <Github className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-foreground/60 hover:text-foreground">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
