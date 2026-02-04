import type { JSX } from 'react'

interface Props {
  isOpen: boolean
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: Props): JSX.Element | null {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-xl p-6 w-full max-w-sm border border-white/10">

        <h2 className="text-lg font-semibold text-white">
          {title}
        </h2>

        <p className="text-gray-400 mt-2">
          {description}
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-slate-700 text-gray-300"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white"
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  )
}
