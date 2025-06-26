import './Popup.css'

function Popup({ movies, onClose }) {
  return (
    <div className="popup-backdrop" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <h2>Possible Movies</h2>
        <ul>
          {movies.map((movie, idx) => (
            <li key={idx}>
              <a
                href={`https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {movie.title}
              </a>
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

export default Popup
