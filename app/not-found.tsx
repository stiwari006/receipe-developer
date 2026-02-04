import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChefHat } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-white">
      <div className="text-center">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <ChefHat className="h-8 w-8 text-primary" />
          <span className="text-3xl font-bold text-primary">GitGrub.ai</span>
        </Link>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-muted-foreground mb-8">Recipe not found</p>
        <Link href="/recipes">
          <Button>Back to Recipes</Button>
        </Link>
      </div>
    </div>
  )
}
