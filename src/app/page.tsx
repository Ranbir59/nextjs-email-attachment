'use client'

import { sendEmail } from '@/actions/sendEmail'
import React, { useState, ChangeEvent, FormEvent } from 'react'

export default function Home() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [auditionFile, setAuditionFile] = useState<File | null>(null)
  const [status, setStatus] = useState('')

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAuditionFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('name', name)
    formData.append('message', message)
    if (auditionFile) {
      formData.append('audition', auditionFile)
    }

    // try {
    //   const res = await fetch('/api/contact', {
    //     method: 'POST',
    //     body: formData,
    //   })

    //   const result = await res.json()
    //   if (res.ok) {
    //     setStatus('Audition sent successfully!')
    //     setName('')
    //     setMessage('')
    //     setAuditionFile(null)
    //   } else {
    //     setStatus(result.error || 'Failed to send audition.')
    //   }
    // } catch (error) {
    //   console.error(error)
    //   setStatus('Error sending audition.')
    // }
    sendEmail()
  }

  return (
    <main className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-xl font-bold mb-4">Audition Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Upload Audition</label>
          <input
            type="file"
            accept="video/*,audio/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
        {status && <p className="text-sm mt-2">{status}</p>}
      </form>
    </main>
  )
}
