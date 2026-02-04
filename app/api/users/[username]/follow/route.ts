import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userToFollow = await prisma.user.findUnique({
      where: { username: params.username },
    })

    if (!userToFollow) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (userToFollow.id === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      )
    }

    const follow = await prisma.follow.create({
      data: {
        followerId: session.user.id,
        followingId: userToFollow.id,
      },
    })

    return NextResponse.json({ follow })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Already following' }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userToUnfollow = await prisma.user.findUnique({
      where: { username: params.username },
    })

    if (!userToUnfollow) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: userToUnfollow.id,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
