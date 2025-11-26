import axios from "axios";
import { useState, useEffect } from "react";
import Header from "./Header";

export default function Home({ user, token }) {
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

  function returnRatingColor(rating) {
    if (rating >= 8) return "text-blue-700";
    else if (rating >= 7) return "text-green-700";
    else if (rating >= 6) return "text-yellow-700";
    else return "text-red-700";
  }

  async function removeFromFav(id) {
    try {
      await axios.delete(`http://localhost:3000/api/users`, {
        headers: {
          "x-auth-token": token,
        },
        data: {
          movieId: id,
        },
      });
      console.log("delted successfully");
    } catch (ex) {
      console.log(ex);
    }
  }

  return (
    <main className="bg-my-black text-white pt-30 h-fit">
      <Header />
      <div className="flex flex-wrap justify-evenly w-[90%] max-w-[1200px] mx-auto gap-3 space-y-3">
        {user &&
          movies.map((movie, i) => {
            return (
              <div
                key={i}
                className="w-65 h-155 bg-my-black-hover flex flex-col p-4 rounded-2xl"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                />
                <div className="flex-1">
                  <h4 className="my-2 font-bold text-2xl">
                    {movie.title.length < 30
                      ? movie.title
                      : movie.title.slice(0, 30) + " ..."}
                  </h4>
                  <p>
                    {movie.overview.length < 100
                      ? movie.overview
                      : movie.overview.slice(0, 100) + " ..."}
                  </p>
                </div>
                <div className="flex justify-between">
                  <div
                    className="bg-white text-black px-4 py-1 rounded-xl cursor-pointer"
                    onClick={() => {
                      removeFromFav(movie.id);
                    }}
                  >
                    {user.favMovies.includes(movie.id)
                      ? "remove from fav"
                      : "add to fav"}
                  </div>
                  <div
                    className={`${returnRatingColor(
                      Number(movie.vote_average)
                    )}`}
                  >
                    {movie.vote_average}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </main>
  );
}
