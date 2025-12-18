import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { add } from "../redux/userInfoAction";
import { useNavigate } from "react-router-dom";
import { Theme } from "./Theme";

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userInfo.user);
  const [editProfile, setEditProfile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(`http://localhost:3000${user.avatar}`);
  const inputRef = useRef(null);
  const [message, setMessage] = useState(null);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [favMovies, setFavMovies] = useState(null);
  const navigate = useNavigate();
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
  useEffect(() => {
    if (editProfile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editProfile]);

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
      dispatch(add(user.data));
    } catch (ex) {
      console.log(ex);
    }
  }

  async function logout() {
    try {
      await axios.post(
        "http://localhost:3000/api/users/logout",
        {},
        {
          withCredentials: true,
        }
      );
      dispatch(add(null));
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  }

  function Message(message, color) {
    setMessage(<p className={`text-${color}-700 mt-6`}>{message}</p>);
  }

  function neutralize() {
    setEditEmail(user.email);
    setEditName(user.name);
    setPreview(`http://localhost:3000${user.avatar}`);
  }

  async function changeProfile(e) {
    e.preventDefault();
    setTimeout(() => {
      setNameError(null);
      setEmailError(null);
    }, 1000);
    if (!validateForm()) return;
    const formData = new FormData();

    if (editName !== user.name) {
      formData.append("name", editName);
    }

    if (editEmail !== user.email) {
      formData.append("email", editEmail);
    }

    if (selectedFile) {
      formData.append("avatar", selectedFile);
    }

    if (![...formData.entries()].length) return;
    try {
      const res = await axios.put(
        "http://localhost:3000/api/users/profile",
        formData,
        { withCredentials: true }
      );
      dispatch(add(res.data.user));
      Message(res.data.message, "green");
      setTimeout(() => {
        setEditProfile(false);
      }, 1000);
    } catch (ex) {
      Message(ex.response.data.message, "red");
      neutralize();
    } finally {
      setTimeout(() => {
        setMessage(null);
      }, 1000);
    }
  }

  function handleProfileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const tempPreview = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreview(tempPreview);
  }

  function cancelEdit() {
    setEditProfile(false);
    neutralize();
  }
  const validateForm = () => {
    let valid = true;

    // Name validation
    if (!editName.trim()) {
      setNameError("Name is required");
      valid = false;
    } else if (editName.length < 5) {
      setNameError("Name should be at least 5 characters");
      valid = false;
    } else {
      setNameError("");
    }
    if (!editEmail.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editEmail)) {
        setEmailError("Invalid email format");
        valid = false;
      } else {
        setEmailError("");
      }
    }
    return valid;
  };

  return (
    <div className="bg-custom min-h-screen w-full box-border text-white flex items-center">
      <title>Profile</title>
      <div className="fixed top-2 left-1">
        <Theme />
      </div>
      <div className="flex flex-wrap gap-3 space-y-3 flex-1 box-border pl-17 pr-50 md:pr-88">
        {favMovies ? (
          favMovies.map((movie, i) => (
            <div
              key={i}
              className="w-65 h-155 bg-white/10 backdrop-blur-md border border-white/20 flex flex-col p-4 rounded-2xl shadow-lg"
            >
              <img
                src={movie.poster_url}
                className="h-[60%] object-cover rounded-t-lg"
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
          <div className="flex items-center justify-center gap-2 h-full w-full">
            <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></span>
            <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:150ms]"></span>
            <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:300ms]"></span>
          </div>
        )}
      </div>

      <div className="min-h-screen flex items-center justify-center p-6 shrink-0 w-70 md:w-88 fixed right-0 top-0">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center">
          {!editProfile ? (
            <>
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
              <h2 className="mt-4 text-3xl font-extrabold text-white drop-shadow">
                {user?.name}
              </h2>

              <p className="mt-2 text-white/80 text-sm break-all">
                {user?.email}
              </p>

              <div className="my-6 h-px bg-white/20" />

              <div className="flex gap-4 justify-center">
                <button
                  className="bg-cyan-500 hover:bg-cyan-600 transition px-5 py-2 rounded-xl text-white font-semibold shadow cursor-pointer"
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  Home
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-600 transition px-5 py-2 rounded-xl text-white font-semibold shadow cursor-pointer"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
              <button
                className="bg-linear-to-r from-cyan-500 to-blue-500 
             hover:from-cyan-600 hover:to-blue-600
             transition px-5 py-2 mt-3 rounded-xl 
             text-white font-semibold shadow cursor-pointer"
                onClick={() => {
                  setEditProfile(true);
                }}
              >
                Edit
              </button>
            </>
          ) : (
            <form onSubmit={changeProfile} className="text-center">
              {/* AVATAR */}
              <img
                src={preview}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-cyan-400 
               shadow-lg object-cover cursor-pointer 
               hover:opacity-80 transition mx-auto"
                onClick={() => fileInputRef.current.click()}
              />

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleProfileChange}
              />

              {/* NAME */}
              <input
                type="text"
                className="mt-4 w-full max-w-xs bg-white/10 text-3xl font-extrabold text-white 
                 drop-shadow px-4 py-2 rounded-xl outline-none 
                 focus:ring-2 focus:ring-cyan-400 text-center"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                ref={inputRef}
              />
              {nameError && <p className="text-red-500 mt-2">{nameError}</p>}

              {/* EMAIL (OPTIONAL – REMOVE IF NOT NEEDED) */}
              {editEmail !== undefined && (
                <input
                  type="email"
                  className="mt-2 text-white/80 text-sm break-all
                 bg-transparent text-center outline-none
                 focus:ring-2 focus:ring-cyan-400 rounded-xl
                 px-4 py-1 mx-auto block"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                />
              )}
              {emailError && <p className="text-red-500 mt-2">{emailError}</p>}

              {/* MESSAGE SLOT (STABLE HEIGHT) */}
              <div className="mt-2 min-h-5">{message}</div>

              {/* DIVIDER */}
              <div className="my-6 h-px bg-white/20" />

              {/* BUTTONS */}
              <div className="flex gap-4 justify-center">
                <button
                  className="bg-cyan-500 hover:bg-cyan-600 transition 
                 px-5 py-2 rounded-xl 
                 text-white font-semibold shadow cursor-pointer"
                  type="submit"
                >
                  Save
                </button>

                <button
                  className="bg-blue-500 hover:bg-blue-600 transition 
                 px-5 py-2 rounded-xl 
                 text-white font-semibold shadow cursor-pointer"
                  onClick={cancelEdit}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
