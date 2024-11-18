import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu } from "lucide-react";

const NavbarSkeleton = () => {
  return (
    <header className="border-b sticky top-0 z-50 bg-background">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          {/* Logo skeleton */}
          <Skeleton className="h-8 w-32 mr-6" />

          {/* Nav items skeleton - hidden on mobile */}
          <div className="hidden md:flex space-x-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle skeleton */}
          <Button variant="outline" size="icon" disabled>
            <Skeleton className="h-5 w-5" />
          </Button>

          {/* Cart button skeleton */}
          <Button variant="outline" size="icon" disabled>
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
          </Button>

          {/* User avatar skeleton */}
          <Button variant="outline" size="icon" disabled>
            <Skeleton className="h-8 w-8 rounded-full" />
          </Button>

          {/* Mobile menu button skeleton */}
          <Button variant="outline" size="icon" className="md:hidden" disabled>
            <Menu className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default NavbarSkeleton;
