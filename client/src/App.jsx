import { useState } from 'react'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })
      const data = await res.json()
      setMovies(data.movies || [])
    } catch (err) {
      console.error('Search failed', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="App">
      <h1>AI Movie Search</h1>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Describe a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {loading && <p>Loading...</p>}
      <div className="movies">
        {movies.map((movie, idx) => (
          <div className="movie" key={idx}>
            <h3>
              {movie.title} {movie.year && <span>({movie.year})</span>}
            </h3>
            <p>{movie.summary}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
