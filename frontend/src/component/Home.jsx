import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./Header";

export default function Home({ user, setUser }) {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const apiKey = import.meta.env.VITE_XMDB_KEY;
  useEffect(() => {
    const loadMovies = async () => {
      try {
        const query = searchParams.get("query");
        let result;
        if (query) {
          const search = await axios.get(
            `https://xmdbapi.com/api/v1/search?q=${query}&limit=10&apiKey=${apiKey}`
          );

          const results = search.data.results;
          const promises = [];
          for (let movie of results) {
            if (movie.id[0] == "t") {
              promises.push(
                axios
                  .get(
                    `https://xmdbapi.com/api/v1/movies/${movie.id}?apiKey=${apiKey}`
                  )
                  .then((r) => r.data)
              );
            }
          }
          result = await Promise.all(promises);
        } else {
          const res = await axios.get(
            `https://xmdbapi.com/api/v1/trending?apiKey=${apiKey}`
          );
          result = res.data.results;
        }

        setMovies(result);
      } catch (ex) {
        console.log(ex);
      }
    };
    loadMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function returnRatingColor(rating) {
    if (rating >= 8) return "text-blue-700";
    else if (rating >= 7) return "text-green-700";
    else if (rating >= 6) return "text-yellow-700";
    else return "text-red-700";
  }

  async function toggleFav(id) {
    try {
      const user = await axios.post(
        `http://localhost:3000/api/users/favMovies`,
        {
          movieId: id,
        },
        { withCredentials: true }
      );
      setUser(user.data);
    } catch (ex) {
      console.log(ex);
    }
  }

  return (
    <main className="bg-linear-to-br from-blue-400 via-blue-300 to-cyan-200 text-white pt-30 min-h-screen">
      <Header setUser={setUser} />
      <div className="flex flex-wrap justify-evenly w-[90%] max-w-[1200px] mx-auto gap-3 space-y-3">
        {user &&
          movies.map((movie, i) => {
            return (
              <div
                key={i}
                className="w-65 h-155 bg-linear-to-br from-blue-500 via-blue-400 to-blue-300
 flex flex-col p-4 rounded-2xl"
              >
                <img src={movie.poster_url} className="h-[60%] object-cover" />
                <div className="flex-1">
                  <h4 className="my-2 font-bold text-2xl">
                    {movie.title.length < 30
                      ? movie.title
                      : movie.title.slice(0, 30) + " ..."}
                  </h4>
                  <p>
                    {movie.plot
                      ? movie.plot.length < 100
                        ? movie.plot
                        : movie.plot.slice(0, 100) + " ..."
                      : "we're recently working on plot..."}
                  </p>
                </div>
                <div className="flex justify-between">
                  <div
                    className="bg-white text-black px-4 py-1 rounded-xl cursor-pointer"
                    onClick={() => {
                      toggleFav(movie.id);
                    }}
                  >
                    {user.favMovies.includes(movie.id)
                      ? "remove from fav"
                      : "add to fav"}
                  </div>
                  <div className={`${returnRatingColor(Number(movie.rating))}`}>
                    {movie.rating}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </main>
  );
}
