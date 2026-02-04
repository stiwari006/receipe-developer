import { getServerSession } from 'next-auth'
import { authOptions } from '../../api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import RecipeDetail from '@/components/RecipeDetail'

export default async function RecipePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  const recipe = await prisma.recipe.findUnique({
    where: { id: params.id },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          name: true,
          avatar: true,
          bio: true,
        },
      },
      forkedFrom: {
        include: {
          author: {
            select: {
              username: true,
              name: true,
            },
          },
        },
      },
      commits: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      _count: {
        select: {
          forks: true,
          likes: true,
          comments: true,
        },
      },
    },
  })

  if (!recipe) {
    notFound()
  }

  if (!recipe.isPublic && recipe.authorId !== session?.user?.id) {
    redirect('/recipes')
  }

  let userLiked = false
  let userFollowing = false

  if (session?.user?.id) {
    const like = await prisma.like.findUnique({
      where: {
        recipeId_userId: {
          recipeId: recipe.id,
          userId: session.user.id,
        },
      },
    })
    userLiked = !!like

    if (recipe.authorId !== session.user.id) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: session.user.id,
            followingId: recipe.authorId,
          },
        },
      })
      userFollowing = !!follow
    }
  }

  return (
    <RecipeDetail
      recipe={recipe}
      session={session}
      userLiked={userLiked}
      userFollowing={userFollowing}
    />
  )
}
