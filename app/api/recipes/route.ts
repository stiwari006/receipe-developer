import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const recipeSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  ingredients: z.array(z.string()),
  steps: z.array(z.string()),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  prepTime: z.number().optional(),
  cookTime: z.number().optional(),
  servings: z.number().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  cuisine: z.string().optional(),
  dietaryTags: z.array(z.string()).optional(),
  imageUrl: z.string().url().optional(),
  isPublic: z.boolean().default(true),
  forkedFromId: z.string().optional(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const authorId = searchParams.get('authorId')
    const tag = searchParams.get('tag')

    const where: any = {
      isPublic: true,
      isArchived: false,
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (authorId) {
      where.authorId = authorId
    }

    if (tag) {
      where.tags = { contains: tag }
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

    return NextResponse.json({ recipes })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = recipeSchema.parse(body)

    const recipe = await prisma.recipe.create({
      data: {
        ...data,
        ingredients: JSON.stringify(data.ingredients),
        steps: JSON.stringify(data.steps),
        tags: JSON.stringify(data.tags || []),
        dietaryTags: JSON.stringify(data.dietaryTags || []),
        authorId: session.user.id,
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
      },
    })

    // Create initial commit
    await prisma.commit.create({
      data: {
        recipeId: recipe.id,
        message: 'Initial recipe',
        changes: JSON.stringify({ type: 'create', data }),
        version: 1,
      },
    })

    return NextResponse.json({ recipe }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
