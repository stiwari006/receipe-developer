import { getServerSession } from 'next-auth'
import { authOptions } from '../../api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import RecipeCard from '@/components/RecipeCard'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChefHat } from 'lucide-react'
import FollowButton from '@/components/FollowButton'

export default async function ProfilePage({
  params,
}: {
  params: { username: string }
}) {
  const session = await getServerSession(authOptions)

  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      _count: {
        select: {
          recipes: true,
          followers: true,
          follows: true,
        },
      },
    },
  })

  if (!user) {
    notFound()
  }

  const recipes = await prisma.recipe.findMany({
    where: {
      authorId: user.id,
      isPublic: true,
      isArchived: false,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          name: true,
          avatar: true,
        },
      },
      _count: {
        select: {
          forks: true,
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  let isFollowing = false
  if (session?.user?.id && session.user.id !== user.id) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: user.id,
        },
      },
    })
    isFollowing = !!follow
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/recipes" className="flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold text-primary">GitGrub.ai</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/recipes">
              <Button variant="ghost">Browse</Button>
            </Link>
            {session && (
              <Link href={`/profile/${session.user?.username}`}>
                <Button variant="ghost">My Profile</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-start gap-6 mb-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar || undefined} />
              <AvatarFallback className="text-2xl">
                {user.name?.[0] || user.username[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                {user.name || user.username}
              </h1>
              <p className="text-muted-foreground mb-4">@{user.username}</p>
              {user.bio && <p className="mb-4">{user.bio}</p>}
              <div className="flex items-center gap-6 mb-4">
                <div>
                  <span className="font-semibold">{user._count.recipes}</span>
                  <span className="text-muted-foreground ml-1">Recipes</span>
                </div>
                <div>
                  <span className="font-semibold">{user._count.followers}</span>
                  <span className="text-muted-foreground ml-1">Followers</span>
                </div>
                <div>
                  <span className="font-semibold">{user._count.follows}</span>
                  <span className="text-muted-foreground ml-1">Following</span>
                </div>
              </div>
              {session && session.user?.id !== user.id && (
                <FollowButton
                  username={user.username}
                  isFollowing={isFollowing}
                />
              )}
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Recipes</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
        {recipes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No recipes yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
