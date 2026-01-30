import { useEffect, useState } from 'react'
import type { ChangeEvent, JSX } from 'react'
import { supabase } from '../lib/supabase'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'

interface Props {
  blogId: string
}

interface Comment {
  id: string
  content: string
  image_url: string | null
  author_id: string
  created_at: string
}

export default function CommentsSection({ blogId }: Props): JSX.Element {
  const user = useSelector((state: RootState) => state.auth.user) as { id: string } | null

  const [comments, setComments] = useState<Comment[]>([])
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [blogId])

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('blog_id', blogId)
      .order('created_at', { ascending: true })

    setComments(data ?? [])
  }

  const handlePost = async () => {
    console.log('AUTH USER:', user)
    if (!user || !content.trim()) return

    setLoading(true)
    let imageUrl: string | null = null

    // Upload image (optional)
    if (image) {
      const path = `${user.id}/${Date.now()}-${image.name}`

      const { error: uploadError } = await supabase.storage
        .from('comment-images')
        .upload(path, image)

        console.log('UPLOAD ERROR:', uploadError)

    if (uploadError) {
      setLoading(false)
      return
    }

      if (!uploadError) {
        imageUrl = supabase.storage
          .from('comment-images')
          .getPublicUrl(path).data.publicUrl
      }
    }

 await supabase.from('comments').insert({
  blog_id: blogId,
  content,
  image_url: imageUrl,
  author_id: user.id
})

  setLoading(false)

    setContent('')
    setImage(null)
    setLoading(false)
    fetchComments()
  

    
  }

  const handleDelete = async (id: string) => {
    await supabase.from('comments').delete().eq('id', id)
    fetchComments()
  }

  

  return (
    <div className="mt-10 space-y-4">
      <h2 className="text-xl font-bold">Comments</h2>

      {comments.map(comment => (
        <div key={comment.id} className="border p-3 rounded">
          <p>{comment.content}</p>

          {comment.image_url && (
            <img
              src={comment.image_url}
              className="mt-2 w-40 rounded"
            />
          )}

          {user?.id === comment.author_id && (
            <button
              onClick={() => handleDelete(comment.id)}
              className="text-sm text-red-600 mt-2"
            >
              Delete
            </button>
          )}
        </div>
      ))}

      {user && (
        <>
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Write a comment..."
            value={content}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setContent(e.target.value)
            }
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setImage(e.target.files?.[0] ?? null)
            }
          />

          <button
            onClick={handlePost}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </>
      )}
    </div>
  )
}
