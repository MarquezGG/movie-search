import { useState, useRef } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [file, setFile] = useState(null)
  const fileRef = useRef(null)
  const [loading, setLoading] = useState(false)

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() && !file) return

    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    const body = { messages: newMessages }
    if (file) {
      const base64 = await toBase64(file)
      body.file = { name: file.name, data: base64 }
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (data.message) {
        setMessages([...newMessages, data.message])
      } else if (data.error) {
        setMessages([
          ...newMessages,
          { role: 'assistant', content: 'Sorry, something went wrong' },
        ])
      }
    } catch (err) {
      console.error('Chat error', err)
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Sorry, something went wrong' },
      ])
    } finally {
      setLoading(false)
      setFile(null)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    const limit = f.type.startsWith('video/') ? 20 : 5
    if (f.size > limit * 1024 * 1024) {
      alert(`File too large. Max ${limit}MB`)
      e.target.value = ''
    } else {
      setFile(f)
    }
  }

  return (
    <div className="chat">
      <div className="messages">
        {messages.map((m, idx) => (
          <div key={idx} className={`message ${m.role}`}>
            <p>{m.content}</p>
            {m.imdb && (
              <p>
                <a href={m.imdb} target="_blank" rel="noreferrer">
                  View on IMDb
                </a>
              </p>
            )}
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <p>...</p>
          </div>
        )}
      </div>
      <form className="input-form" onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe a movie..."
        />
        <input
          type="file"
          accept="image/*,video/*"
          ref={fileRef}
          onChange={handleFile}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result.split(',')[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default App
