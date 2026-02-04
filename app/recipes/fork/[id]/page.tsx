'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, X } from 'lucide-react'

export default function ForkRecipePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [originalRecipe, setOriginalRecipe] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [''],
    steps: [''],
    tags: [''],
    notes: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    cuisine: '',
    dietaryTags: [''],
    imageUrl: '',
  })

  useEffect(() => {
    fetchRecipe()
  }, [])

  const fetchRecipe = async () => {
    try {
      const response = await fetch(`/api/recipes/${params.id}`)
      if (!response.ok) {
        setError('Recipe not found')
        return
      }
      const data = await response.json()
      setOriginalRecipe(data.recipe)

      const ingredients = JSON.parse(data.recipe.ingredients || '[]')
      const steps = JSON.parse(data.recipe.steps || '[]')
      const tags = JSON.parse(data.recipe.tags || '[]')
      const dietaryTags = JSON.parse(data.recipe.dietaryTags || '[]')

      setFormData({
        title: data.recipe.title,
        description: data.recipe.description || '',
        ingredients: ingredients.length > 0 ? ingredients : [''],
        steps: steps.length > 0 ? steps : [''],
        tags: tags.length > 0 ? tags : [''],
        notes: data.recipe.notes || '',
        prepTime: data.recipe.prepTime?.toString() || '',
        cookTime: data.recipe.cookTime?.toString() || '',
        servings: data.recipe.servings?.toString() || '',
        difficulty: data.recipe.difficulty || 'medium',
        cuisine: data.recipe.cuisine || '',
        dietaryTags: dietaryTags.length > 0 ? dietaryTags : [''],
        imageUrl: data.recipe.imageUrl || '',
      })
    } catch (err) {
      setError('Failed to load recipe')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const ingredients = formData.ingredients.filter((i) => i.trim())
      const steps = formData.steps.filter((s) => s.trim())
      const tags = formData.tags.filter((t) => t.trim())
      const dietaryTags = formData.dietaryTags.filter((d) => d.trim())

      if (!formData.title || ingredients.length === 0 || steps.length === 0) {
        setError('Please fill in all required fields')
        return
      }

      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ingredients,
          steps,
          tags,
          dietaryTags,
          prepTime: formData.prepTime ? parseInt(formData.prepTime) : undefined,
          cookTime: formData.cookTime ? parseInt(formData.cookTime) : undefined,
          servings: formData.servings ? parseInt(formData.servings) : undefined,
          forkedFromId: params.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to fork recipe')
        return
      }

      router.push(`/recipes/${data.recipe.id}`)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (error && !originalRecipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  const addIngredient = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, ''] })
  }

  const removeIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index),
    })
  }

  const addStep = () => {
    setFormData({ ...formData, steps: [...formData.steps, ''] })
  }

  const removeStep = (index: number) => {
    setFormData({
      ...formData,
      steps: formData.steps.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Fork Recipe</CardTitle>
            <CardDescription>
              Create your own version of this recipe with your modifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingredients">Ingredients *</Label>
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={ingredient}
                      onChange={(e) => {
                        const newIngredients = [...formData.ingredients]
                        newIngredients[index] = e.target.value
                        setFormData({ ...formData, ingredients: newIngredients })
                      }}
                      placeholder="e.g., 2 cups flour"
                    />
                    {formData.ingredients.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIngredient(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addIngredient}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Ingredient
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="steps">Steps *</Label>
                {formData.steps.map((step, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Textarea
                      value={step}
                      onChange={(e) => {
                        const newSteps = [...formData.steps]
                        newSteps[index] = e.target.value
                        setFormData({ ...formData, steps: newSteps })
                      }}
                      placeholder={`Step ${index + 1}`}
                      rows={2}
                    />
                    {formData.steps.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStep(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addStep}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Step
                </Button>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Forking...' : 'Fork Recipe'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
