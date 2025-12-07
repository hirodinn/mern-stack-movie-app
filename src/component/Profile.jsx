import axios from "axios";
import { useEffect, useState } from "react";

export default function Profile({ user }) {
  const [favMovies, setFavMovies] = useState(null);
  useEffect(() => {
    const loadFav = async () => {
      const requests = user.favMovies.map((id) =>
        axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
          params: { api_key: import.meta.env.VITE_TMDB_KEY },
        })
      );
      const data = await Promise.all(requests);
      setFavMovies(data.map((m) => m.data));
    };
    loadFav();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="bg-my-black min-h-screen w-full box-border text-white flex flex-col items-center justify-center py-10">
      <title>Profile</title>
      <h1 className="text-4xl">Name: {user.name}</h1>
      <h1 className="text-4xl my-5">Email: {user.email}</h1>
      <h1 className="text-4xl mb-5">Favorite Movies</h1>

      <div className="flex flex-wrap gap-3 space-y-3 w-[90%] max-w-6xl mx-auto">
        {favMovies ? (
          favMovies.map((fav, i) => {
            return (
              <div key={i} className="w-65 h-120 border rounded-2xl">
                <img
                  src={`https://image.tmdb.org/t/p/w500${fav.poster_path}`}
                />
                <h4 className="my-2 font-bold text-2xl">
                  {fav.title.length < 30
                    ? fav.title
                    : fav.title.slice(0, 30) + " ..."}
                </h4>
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
