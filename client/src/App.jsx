import { useState } from 'react'
import './App.css'
import Popup from './Popup'

function App() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  const sampleMovies = [
    { title: 'The Matrix' },
    { title: 'Inception' },
    { title: 'Interstellar' }
  ]

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
      setMovies((data.movies || sampleMovies).slice(0, 3))
    } catch (err) {
      console.error('Search failed', err)
      setMovies(sampleMovies)
    } finally {
      setLoading(false)
      setShowPopup(true)
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
      {showPopup && (
        <Popup movies={movies} onClose={() => setShowPopup(false)} />
      )}
    </div>
  )
}

export default App
