'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react'

export default function AuditionForm() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [auditionFile, setAuditionFile] = useState<File | null>(null)
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; text: string }>({
    type: '',
    text: '',
  })
  const [loading, setLoading] = useState(false)

  // const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files?.[0]) {
  //     setAuditionFile(e.target.files[0])
  //   } else {
  //     setAuditionFile(null)
  //   }
  //   setStatus({ type: '', text: '' })
  // }

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setter(e.target.value)
    setStatus({ type: '', text: '' })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: '', text: '' })

    const formData = new FormData()
    formData.append('name', name)
    formData.append('message', message)
    if (auditionFile) {
      formData.append('audition', auditionFile)
    }

    try {
      const res = await fetch('/api/audition', {
        method: 'POST',
        body: formData,
      })

      const result = await res.json()
      if (res.ok) {
        setStatus({ type: 'success', text: 'Audition sent successfully!' })
        setName('')
        setMessage('')
        setAuditionFile(null)
      } else {
        setStatus({ type: 'error', text: result.error || 'Failed to send audition.' })
      }
    } catch (error) {
      console.error(error)
      setStatus({ type: 'error', text: 'Network error: failed to send audition.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-xl font-bold mb-4">Audition Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4" aria-live="polite" aria-atomic="true">
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">Namdwkdnwkdlnwe</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={handleInputChange(setName)}
            required
            className="w-full p-2 border rounded"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="message" className="block mb-1 font-medium">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={handleInputChange(setMessage)}
            required
            className="w-full p-2 border rounded"
            disabled={loading}
          />
        </div>

        {/* <div>
          <label htmlFor="audition" className="block mb-1 font-medium">Upload Audition (optional)</label>
          <input
            id="audition"
            type="file"
            accept="video/*,audio/*"
            onChange={handleFileChange}
            className="w-full"
            disabled={loading}
          />
        </div> */}

        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 text-white rounded ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Sending...' : 'Submit'}
        </button>

        {status.text && (
          <p
            role={status.type === 'error' ? 'alert' : undefined}
            className={`text-sm mt-2 ${
              status.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {status.text}
          </p>
        )}
      </form>
    </main>
  )
}
