import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { JSX,ChangeEvent, FormEvent } from 'react'
import BackButton from '../components/BackButton'

export function CreateEditBlogPage(): JSX.Element {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [existingImage, setExistingImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load existing blog when editing
  useEffect(() => {
    if (!isEdit) return

    supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setTitle(data.title)
        setContent(data.content)
        setExistingImage(data.image_url)
      })
  }, [id, isEdit])

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      setError('Not authenticated')
      setLoading(false)
      return
    }

    let imageUrl = existingImage

    // 🔹 Upload image
    if (image) {
      const filePath = `${user.id}/${Date.now()}-${image.name}`

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, image)

      if (uploadError) {
        setError(uploadError.message)
        setLoading(false)
        return
      }

      imageUrl = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath).data.publicUrl
    }

    // 🔹 Insert or update blog
    const { error } = isEdit
      ? await supabase
          .from('blogs')
          .update({
            title,
            content,
            image_url: imageUrl
          })
          .eq('id', id)
      : await supabase
          .from('blogs')
          .insert({
            title,
            content,
            image_url: imageUrl,
            author_id: user.id
          })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    navigate('/blogs')
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        {isEdit ? 'Edit Blog' : 'Create Blog'}
      </h1>

      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full border p-2 h-40"
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />

        {existingImage && (
          <img src={existingImage} className="w-48 rounded" />
        )}

        <input type="file" accept="image/*" onChange={handleImageChange} />

        <button
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Saving...' : 'Save Blog'}
        </button>
      </form>
      <BackButton />
    </div>
  )
}
 