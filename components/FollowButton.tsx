'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { UserPlus, UserMinus } from 'lucide-react'

interface FollowButtonProps {
  username: string
  isFollowing: boolean
}

export default function FollowButton({
  username,
  isFollowing: initialFollowing,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing)
  const [loading, setLoading] = useState(false)

  const handleFollow = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/users/${username}/follow`, {
        method: isFollowing ? 'DELETE' : 'POST',
      })

      if (response.ok) {
        setIsFollowing(!isFollowing)
      }
    } catch (error) {
      console.error('Failed to follow/unfollow user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={isFollowing ? 'outline' : 'default'}
      onClick={handleFollow}
      disabled={loading}
    >
      {isFollowing ? (
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
  )
}
