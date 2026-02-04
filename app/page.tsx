import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChefHat, GitFork, Users, Search } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold text-primary">GitGrub.ai</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Version Control for Recipes
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Fork, remix, and collaborate on recipes. Like GitHub, but for your favorite meals.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="text-lg px-8">
              Get Started
            </Button>
          </Link>
          <Link href="/recipes">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Browse Recipes
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <GitFork className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Fork & Remix</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Fork any recipe and create your own version with substitutions, dietary tweaks, or regional spins.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Collaborate</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Follow chefs, submit pull requests for recipe improvements, and build a community around cooking.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Search className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Discover</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Search and filter through a library of community-tested recipes with full commit histories.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <ChefHat className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Standardized</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Clean, standardized recipe format. No more scrolling through 17 paragraphs to find ingredients.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 GitGrub.ai - Version Control for Recipes</p>
        </div>
      </footer>
    </div>
  )
}
