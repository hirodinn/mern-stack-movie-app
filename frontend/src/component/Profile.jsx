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
    <div className="bg-linear-to-br from-blue-400 via-blue-300 to-cyan-200 min-h-screen w-full box-border text-white flex items-center">
      <title>Profile</title>

      {/* Movie Cards Section */}
      <div className="flex flex-wrap gap-3 space-y-3 flex-1 box-border px-15 pr-88">
        {favMovies ? (
          favMovies.map((movie, i) => (
            <div
              key={i}
              className="w-65 h-155 bg-white/10 backdrop-blur-md border border-white/20 flex flex-col p-4 rounded-2xl shadow-lg"
            >
              <img
                src={movie.poster_url}
                className="h-[60%] object-cover rounded-lg"
              />
              <div className="flex-1 mt-2">
                <h4 className="font-bold text-2xl">
                  {movie.title.length < 30
                    ? movie.title
                    : movie.title.slice(0, 30) + " ..."}
                </h4>
                <p className="text-white/80 text-sm mt-1">
                  {movie.plot
                    ? movie.plot.length < 100
                      ? movie.plot
                      : movie.plot.slice(0, 100) + " ..."
                    : "we're recently working on plot..."}
                </p>
              </div>
              <div className="flex justify-between mt-2">
                <div
                  className="bg-white text-black px-4 py-1 rounded-xl cursor-pointer hover:bg-gray-200 transition"
                  onClick={() => removeFav(movie.id)}
                >
                  Remove from fav
                </div>
                <div
                  className={`${returnRatingColor(Number(movie.vote_average))}`}
                >
                  {movie.vote_average}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="w-14 h-14 rounded-full animate-spin border-2 border-blue-900 border-b-blue-300 mx-auto"></div>
        )}
      </div>

      {/* Profile Sidebar */}
      <div className="min-h-screen flex items-center justify-center p-6 shrink-0 w-88 fixed right-5 top-0">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center">
          {/* Avatar */}
          <div className="flex justify-center">
            <img
              src={
                user?.avatar
                  ? `http://localhost:3000${user.avatar}`
                  : "https://ui-avatars.com/api/?name=User&background=22d3ee&color=fff"
              }
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-cyan-400 shadow-lg object-cover"
            />
          </div>

          {/* Name */}
          <h2 className="mt-4 text-3xl font-extrabold text-white drop-shadow">
            {user?.name}
          </h2>

          {/* Email */}
          <p className="mt-2 text-white/80 text-sm break-all">{user?.email}</p>

          {/* Divider */}
          <div className="my-6 h-px bg-white/20" />

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <button className="bg-cyan-500 hover:bg-cyan-600 transition px-5 py-2 rounded-xl text-white font-semibold shadow">
              Edit Profile
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 transition px-5 py-2 rounded-xl text-white font-semibold shadow">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
