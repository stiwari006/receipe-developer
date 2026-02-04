import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import RecipeCard from '@/components/RecipeCard'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, ChefHat, Search } from 'lucide-react'
import RecipesSearch from '@/components/RecipesSearch'

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: { search?: string; tag?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const where: any = {
    isPublic: true,
    isArchived: false,
  }

  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search, mode: 'insensitive' } },
      { description: { contains: searchParams.search, mode: 'insensitive' } },
    ]
  }

  if (searchParams.tag) {
    where.tags = { contains: searchParams.tag }
  }

  const recipes = await prisma.recipe.findMany({
    where,
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
    take: 50,
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold text-primary">GitGrub.ai</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/recipes/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Recipe
              </Button>
            </Link>
            <Link href={`/profile/${session.user?.username}`}>
              <Button variant="ghost">Profile</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Discover Recipes</h1>
        <RecipesSearch initialSearch={searchParams.search} initialTag={searchParams.tag} />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
        {recipes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No recipes yet. Be the first to create one!</p>
            <Link href="/recipes/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Recipe
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
