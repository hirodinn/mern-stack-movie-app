import axios from "axios";
import { useEffect, useState } from "react";

export default function Profile({ user, setUser }) {
  const [favMovies, setFavMovies] = useState(null);
  const apiKey = import.meta.env.VITE_XMDB_KEY;

  useEffect(() => {
    const loadFav = async () => {
      const requests = user.favMovies.map((id) =>
        axios.get(`https://xmdbapi.com/api/v1/movies/${id}?apiKey=${apiKey}`)
      );
      const data = await Promise.all(requests);
      setFavMovies(data.map((m) => m.data));
    };
    loadFav();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function returnRatingColor(rating) {
    if (rating >= 8) return "text-blue-700";
    else if (rating >= 7) return "text-green-700";
    else if (rating >= 6) return "text-yellow-700";
    else return "text-red-700";
  }

  async function removeFav(id) {
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
    <div className="bg-my-black min-h-screen w-full box-border text-white flex flex-col items-center justify-center py-10">
      <title>Profile</title>
      <h1 className="text-4xl">Name: {user.name}</h1>
      <h1 className="text-4xl my-5">Email: {user.email}</h1>
      <h1 className="text-4xl mb-5">Favorite Movies</h1>

      <div className="flex flex-wrap gap-3 space-y-3 w-[90%] max-w-6xl mx-auto">
        {favMovies ? (
          favMovies.map((movie, i) => {
            return (
              <div
                key={i}
                className="w-65 h-155 bg-my-black-hover flex flex-col p-4 rounded-2xl"
              >
                <img src={movie.poster_url} />
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
                      removeFav(movie.id);
                    }}
                  >
                    remove from fav
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
          })
        ) : (
          <div className="w-14 h-14 rounded-full animate-spin border-2 border-blue-900 border-b-blue-300 mx-auto"></div>
        )}
      </div>
    </div>
  );
}
