'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChefHat, Plus, LogOut } from 'lucide-react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <ChefHat className="h-6 w-6 text-primary" />
          <span className="text-2xl font-bold text-primary">GitGrub.ai</span>
        </Link>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/recipes">
                <Button variant="ghost">Browse</Button>
              </Link>
              <Link href="/recipes/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Recipe
                </Button>
              </Link>
              <Link href={`/profile/${session.user?.username}`}>
                <Button variant="ghost">Profile</Button>
              </Link>
              <Button variant="ghost" onClick={() => signOut()}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
