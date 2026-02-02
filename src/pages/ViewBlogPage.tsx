import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { JSX } from 'react'
import CommentsSection from '../components/CommentsSection'
import BackButton from '../components/BackButton'

interface Blog {
  id: string
  title: string
  content: string
  image_url: string | null
  author_id: string
}

export function ViewBlogPage(): JSX.Element {
  const [error] = useState<string | null>(null)
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [blog, setBlog] = useState<Blog | null>(null)

  useEffect(() => {
    fetchBlog()
  }, [id])

  const fetchBlog = async () => {
    const { data } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single()

    setBlog(data)
  }

  const handleDelete = async () => {
      const confirm = window.confirm('Delete this blog?')
       if (!confirm) return
       
    await supabase.from('blogs').delete().eq('id', id)
    navigate('/blogs')

    if (!error) {
    navigate('/blogs')
  }
  }



  if (!blog) return <p>Loading...</p>

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold">{blog.title}</h1>

      {blog.image_url && (
  <img src={blog.image_url} className="rounded mb-4" />
)}
      

      <p>{blog.content}</p>

      <div className="flex gap-2">
        <Link to={`/edit-blog/${blog.id}`} className="border px-3 py-1">
          Edit
        </Link>
        <button
          onClick={handleDelete}
          className="border px-4 py-2 text-red-600"
        >
          Delete
        </button>
      </div>

      <CommentsSection blogId={blog.id} />
<BackButton />
    </div>
  )
}
