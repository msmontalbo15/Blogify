import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { JSX } from 'react'
import CommentsSection from '../components/CommentsSection'
import BackButton from '../components/BackButton'

interface Blog {
  id: string
  title: string
  content: string
  created_at: string
  image_url: string | null
  author_id: string
  profiles: {
    full_name: string
  }[]
}

export function ViewBlogPage(): JSX.Element {
  // const [error] = useState<string | null>(null)
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [userId, setUserId] = useState<string | null>(null)

  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      // get logged-in user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUserId(user?.id ?? null)

      // fetch blog + author name
      const { data, error } = await supabase
  .from('blogs')
  .select(`
    id,
    title,
    content,
    created_at,
    image_url,
    author_id,
    profiles:profiles!blogs_author_id_fkey (
      full_name
    )
  `)
  .eq('id', id)
  .single()

if (error) {
  console.error(error)
  return
}

setBlog(data)

      setLoading(false)
    }

    fetchData()
  }, [id])

  const handleDelete = async () => {
    if (!blog) return

    const { error } = await supabase
      .from("blogs")
      .delete()
      .eq("id", blog.id)

    if (!error) {
      navigate("/")
    }
  }

  if (loading) return <p>Loading...</p>
  if (!blog) return <p>Blog not found</p>

  const isAuthor = userId === blog.author_id

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold pt-12">{blog.title}</h1>

      {blog.image_url && (
        <img src={blog.image_url} className="rounded mb-4" />
      )}

      <p>{blog.content}</p>

      <p className="text-sm text-gray-500">
        Written by <span className="font-medium">{blog.profiles.full_name}</span>
      </p>

      {isAuthor && (
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/edit/${blog.id}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      )}

      <CommentsSection blogId={blog.id} />
      <BackButton />
    </div>
  )
}
