import { useNavigate } from 'react-router-dom'

export default function BackButton() {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(-1)}
      className="
        flex items-center gap-2
        text-slate-400 hover:text-white
        transition mb-6
      "
    >
      Back
    </button>
  )
}
