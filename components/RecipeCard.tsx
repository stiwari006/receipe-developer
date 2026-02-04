import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { GitFork, Heart, MessageCircle, Clock } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

interface RecipeCardProps {
  recipe: {
    id: string
    title: string
    description: string | null
    tags: string
    prepTime: number | null
    cookTime: number | null
    imageUrl: string | null
    author: {
      username: string
      name: string | null
      avatar: string | null
    }
    createdAt: Date
    _count: {
      forks: number
      likes: number
      comments: number
    }
  }
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const tags = JSON.parse(recipe.tags || '[]') as string[]
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)

  return (
    <Link href={`/recipes/${recipe.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        {recipe.imageUrl && (
          <div className="h-48 bg-muted rounded-t-lg overflow-hidden">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="line-clamp-2">{recipe.title}</CardTitle>
          {recipe.description && (
            <CardDescription className="line-clamp-2">
              {recipe.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline">+{tags.length - 3}</Badge>
            )}
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-4">
              {totalTime > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{totalTime}m</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <GitFork className="h-4 w-4" />
                <span>{recipe._count.forks}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{recipe._count.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{recipe._count.comments}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-4 border-t">
            <Avatar className="h-6 w-6">
              <AvatarImage src={recipe.author.avatar || undefined} />
              <AvatarFallback>
                {recipe.author.name?.[0] || recipe.author.username[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">@{recipe.author.username}</span>
            <span className="text-xs text-muted-foreground ml-auto">
              {formatRelativeTime(recipe.createdAt)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
