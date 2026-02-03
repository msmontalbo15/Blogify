import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { JSX } from 'react'
import { motion } from "framer-motion"

 
interface Blog {
  id: string
  title: string
  content: string
  image_url: string | null
  created_at: string
  author: {
    full_name: string
    avatar_url: string | null
  }
}


const PAGE_SIZE = 5

export function BlogListPage(): JSX.Element {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [page, setPage] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    fetchBlogs()
  }, [page])

const fetchBlogs = async () => {
  setLoading(true)

  const from = page * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data, error } = await supabase
  .from('blogs')
  .select(`
    id,
    title,
    content,
    image_url,
    created_at,
    author:profiles (
      full_name,
      avatar_url
    )
  `)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error fetching blogs:', error.message)
  } else if (data) {
    // We map the data to flatten the author array into a single object
    const formattedBlogs = data.map((blog: any) => ({
      ...blog,
      // If author is an array, take the first element; otherwise use as is
      author: Array.isArray(blog.author) ? blog.author[0] : blog.author
    })) as Blog[]

    setBlogs(formattedBlogs)
  }
  
  setLoading(false)
}

  if (loading && blogs.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-gray-400">
        Loading blogs...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200">
      <div className="max-w-5xl mx-auto px-6 py-20">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white">
            From the blog
          </h1>
          <p className="mt-4 text-gray-400">
            Learn how to grow your business with expert advice.
          </p>
        </div>

        {/* Blog Cards */}
        <div className="space-y-20">
          {blogs.map(blog => (
            <motion.article key={blog.id}
              className="
                  bg-white/5 border border-white/10
                  rounded-xl p-6 hover:border-blue-500/40
                  transition cursor-pointer
                  transition-transform duration-300 group-hover:scale-105
                "
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Link to={`/blogs/${blog.id}`}>

                {/* Image */}
                {blog.image_url && (
                  <div className="mb-6 rounded-2xl overflow-hidden shadow-xl">
                    <img
                      src={blog.image_url}
                      alt={blog.title}
                      className="w-full h-[420px] object-cover"
                    />
                  </div>
                )}

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                  <span>
                    {new Date(blog.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-semibold text-white group-hover:text-indigo-400 transition">
                  {blog.title.substring(0, 100)}...
                </h2>

                {/* Excerpt */}
                <p className="mt-3 text-gray-400 max-w-3xl">
                  {blog.content.substring(0, 180)}...
                </p>

                {/* Author */}
                <div className="mt-6 flex items-center gap-4">
                  {blog.author?.avatar_url ? (
                    <img
                      src={blog.author.avatar_url}
                      alt={blog.author.full_name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                      {blog.author?.full_name?.charAt(0)}
                    </div>
                  )}

                  <div>
                    <p className="text-white text-sm font-medium">
                      {blog.author?.full_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      Author
                    </p>
                  </div>
                </div>

              </Link>
              <Link to={`/blogs/${blog.id}`} className="text-blue-600">Read more</Link>

            </motion.article>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-20 flex justify-between">
          <button
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className="px-5 py-2 rounded-lg bg-slate-800 text-gray-300 hover:bg-slate-700 disabled:opacity-40"
          >
            Previous
          </button>

          <button
            onClick={() => setPage(p => p + 1)}
            className="px-5 py-2 rounded-lg bg-slate-800 text-gray-300 hover:bg-slate-700"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  )
}
