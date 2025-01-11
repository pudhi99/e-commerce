"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"; // Adjust import path as needed
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // Adjust import path as needed
import { Button } from "@/components/ui/button"; // Adjust import path as needed
import { User, Package, Heart, MapPin, LogOut } from "lucide-react";

export default function SessionDropdown({ session }) {
  console.log(session, "session");
  return session ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.user.image} />
            <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/account/profile" className="flex items-center w-full">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/account/orders" className="flex items-center w-full">
            <Package className="mr-2 h-4 w-4" />
            <span>Orders</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/account/wishlist" className="flex items-center w-full">
            <Heart className="mr-2 h-4 w-4" />
            <span>Wishlist</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/account/addresses" className="flex items-center w-full">
            <MapPin className="mr-2 h-4 w-4" />
            <span>Addresses</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600" onSelect={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Button variant="ghost" size="icon" asChild>
      <Link href="/login">
        <User className="h-5 w-5" />
      </Link>
    </Button>
  );
}
