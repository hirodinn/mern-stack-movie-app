import axios from "axios";
import { useState, useEffect } from "react";

function App() {
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    const loadMovies = async () => {
      try {
        let popular = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${
            import.meta.env.VITE_TMDB_KEY
          }`
        );
        setMovies(popular.data.results);
      } catch (ex) {
        console.log(ex);
      }
    };
    loadMovies();
  }, []);

  return (
    <main>
      {movies.map((movie, i) => {
        return <div key={i}>{movie.title}</div>;
      })}
    </main>
  );
}

export default App;
