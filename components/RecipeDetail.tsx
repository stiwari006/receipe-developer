'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import {
  GitFork,
  Heart,
  MessageCircle,
  Clock,
  ChefHat,
  UserPlus,
  UserMinus,
  History,
} from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

interface RecipeDetailProps {
  recipe: any
  session: any
  userLiked: boolean
  userFollowing: boolean
}

export default function RecipeDetail({
  recipe,
  session,
  userLiked: initialLiked,
  userFollowing: initialFollowing,
}: RecipeDetailProps) {
  const router = useRouter()
  const [userLiked, setUserLiked] = useState(initialLiked)
  const [userFollowing, setUserFollowing] = useState(initialFollowing)
  const [likesCount, setLikesCount] = useState(recipe._count.likes)
  const [comments, setComments] = useState<any[]>([])
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [recipe.id])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/recipes/${recipe.id}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error('Failed to fetch comments')
    }
  }

  const ingredients = JSON.parse(recipe.ingredients || '[]') as string[]
  const steps = JSON.parse(recipe.steps || '[]') as string[]
  const tags = JSON.parse(recipe.tags || '[]') as string[]
  const dietaryTags = JSON.parse(recipe.dietaryTags || '[]') as string[]
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)

  const handleLike = async () => {
    if (!session) {
      router.push('/login')
      return
    }

    try {
      const response = await fetch(`/api/recipes/${recipe.id}/like`, {
        method: userLiked ? 'DELETE' : 'POST',
      })

      if (response.ok) {
        setUserLiked(!userLiked)
        setLikesCount(userLiked ? likesCount - 1 : likesCount + 1)
      }
    } catch (error) {
      console.error('Failed to like recipe')
    }
  }

  const handleFollow = async () => {
    if (!session) {
      router.push('/login')
      return
    }

    try {
      const response = await fetch(`/api/users/${recipe.author.id}/follow`, {
        method: userFollowing ? 'DELETE' : 'POST',
      })

      if (response.ok) {
        setUserFollowing(!userFollowing)
      }
    } catch (error) {
      console.error('Failed to follow user')
    }
  }

  const handleFork = async () => {
    if (!session) {
      router.push('/login')
      return
    }

    router.push(`/recipes/fork/${recipe.id}`)
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session || !commentText.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/recipes/${recipe.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText }),
      })

      if (response.ok) {
        const newComment = await response.json()
        setComments([newComment.comment, ...comments])
        setCommentText('')
      }
    } catch (error) {
      console.error('Failed to post comment')
    } finally {
      setLoading(false)
    }
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
                <Button variant="ghost">Profile</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {recipe.forkedFrom && (
          <div className="mb-4 text-sm text-muted-foreground">
            Forked from{' '}
            <Link
              href={`/recipes/${recipe.forkedFrom.id}`}
              className="text-primary hover:underline"
            >
              {recipe.forkedFrom.title}
            </Link>{' '}
            by @{recipe.forkedFrom.author.username}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {recipe.imageUrl && (
              <div className="h-64 md:h-96 bg-muted rounded-lg overflow-hidden">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">{recipe.title}</CardTitle>
                {recipe.description && (
                  <CardDescription className="text-base">
                    {recipe.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                  {dietaryTags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Ingredients</h3>
                  <ul className="space-y-2">
                    {ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Instructions</h3>
                  <ol className="space-y-3">
                    {steps.map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </span>
                        <span className="flex-1">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {recipe.notes && (
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Notes</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {recipe.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Commit History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recipe.commits.map((commit: any) => (
                    <div
                      key={commit.id}
                      className="flex items-start gap-3 p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{commit.message}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatRelativeTime(commit.createdAt)} • Version{' '}
                          {commit.version}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Comments ({recipe._count.comments})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {session && (
                  <form onSubmit={handleComment} className="space-y-2">
                    <Textarea
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      rows={3}
                    />
                    <Button type="submit" disabled={loading || !commentText.trim()}>
                      Post Comment
                    </Button>
                  </form>
                )}
                <div className="space-y-4">
                  {comments.map((comment: any) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar>
                        <AvatarImage src={comment.author.avatar || undefined} />
                        <AvatarFallback>
                          {comment.author.name?.[0] || comment.author.username[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">
                            @{comment.author.username}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeTime(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={recipe.author.avatar || undefined} />
                    <AvatarFallback>
                      {recipe.author.name?.[0] || recipe.author.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Link
                      href={`/profile/${recipe.author.username}`}
                      className="font-semibold hover:underline"
                    >
                      {recipe.author.name || recipe.author.username}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      @{recipe.author.username}
                    </p>
                  </div>
                </div>
                {session && session.user?.id !== recipe.author.id && (
                  <Button
                    variant={userFollowing ? 'outline' : 'default'}
                    className="w-full"
                    onClick={handleFollow}
                  >
                    {userFollowing ? (
                      <>
                        <UserMinus className="h-4 w-4 mr-2" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Total Time</span>
                  </div>
                  <span className="font-medium">
                    {totalTime > 0 ? `${totalTime} min` : 'N/A'}
                  </span>
                </div>
                {recipe.prepTime && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Prep</span>
                    <span className="font-medium">{recipe.prepTime} min</span>
                  </div>
                )}
                {recipe.cookTime && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Cook</span>
                    <span className="font-medium">{recipe.cookTime} min</span>
                  </div>
                )}
                {recipe.servings && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Servings</span>
                    <span className="font-medium">{recipe.servings}</span>
                  </div>
                )}
                {recipe.difficulty && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Difficulty</span>
                    <Badge variant="outline" className="capitalize">
                      {recipe.difficulty}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-3">
                  <Button
                    variant={userLiked ? 'default' : 'outline'}
                    onClick={handleLike}
                    className="w-full"
                  >
                    <Heart
                      className={`h-4 w-4 mr-2 ${userLiked ? 'fill-current' : ''}`}
                    />
                    {userLiked ? 'Liked' : 'Like'} ({likesCount})
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleFork}
                    className="w-full"
                  >
                    <GitFork className="h-4 w-4 mr-2" />
                    Fork Recipe ({recipe._count.forks})
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
