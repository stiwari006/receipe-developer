'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

interface RecipesSearchProps {
  initialSearch?: string
  initialTag?: string
}

export default function RecipesSearch({
  initialSearch,
  initialTag,
}: RecipesSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(initialSearch || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search.trim()) {
      params.set('search', search.trim())
    }
    if (initialTag) {
      params.set('tag', initialTag)
    }
    router.push(`/recipes?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button type="submit">Search</Button>
      {(initialSearch || initialTag) && (
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setSearch('')
            router.push('/recipes')
          }}
        >
          Clear
        </Button>
      )}
    </form>
  )
}
