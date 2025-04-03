/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext, useRef } from "react";
import { userContext } from "../../App";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEllipsisV } from "react-icons/fa";

const Profile = () => {
  const { state, dispatch } = useContext(userContext);
  const [mypics, setMyPics] = useState([]);
  const [showMenu, setShowMenu] = useState(null);
  const [image, setImage] = useState(null);
  const inputDp = useRef(null);

  useEffect(() => {
    fetch("http://localhost:2048/mypost", {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
    })
      .then((res) => res.json())
      .then((data) => setMyPics(data.mypost));
  }, []);

  useEffect(() => {
    if (!image) return;

    toast.info("Uploading profile picture...");
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "Insta Clone");
    data.append("cloud_name", "ascoder");

    fetch("https://api.cloudinary.com/v1_1/ascoder/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        fetch("http://localhost:2048/updatedp", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          body: JSON.stringify({ dp: data.url }),
        })
          .then((res) => res.json())
          .then((result) => {
            if (result.err) {
              toast.error(result.err);
            } else {
              const updatedUser = { ...state, dp: data.url };
              localStorage.setItem("user", JSON.stringify(updatedUser));
              dispatch({ type: "UPDATEDP", payload: data.url });
              toast.success("Profile picture updated!");
              setImage(null);
              inputDp.current.value = "";
            }
          });
      })
      .catch(() => toast.error("Image upload failed."));
  }, [image]);

  const deletePost = (postId) => {
    fetch(`http://localhost:2048/deletepost/${postId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
    })
      .then((res) => res.json())
      .then(() => {
        toast.success("Post deleted!");
        setMyPics(mypics.filter((item) => item._id !== postId));
      })
      .catch(() => toast.error("Failed to delete post"));
  };

  return (
    <div className="flex flex-col gap-6 px-4">
      <div className="flex flex-col gap-4 border-b-2 md:w-[85%] w-full mx-auto py-6">
        <div className="flex items-center sm:flex-row flex-col justify-center lg:gap-20 md:gap-10 gap-6">
          <div className="relative">
            <img
              src={state?.dp || "loading"}
              alt="profile"
              className="sm:w-[200px] sm:h-[200px] w-[150px] h-[150px] rounded-full object-cover border-4 border-gray-300"
            />
            <input
              type="file"
              ref={inputDp}
              className="hidden"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <button
              onClick={() => inputDp.current.click()}
              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Upload Profile Picture
            </button>
          </div>
          <div className="flex flex-col gap-3 text-center sm:text-left">
            <h3 className="text-3xl sm:text-4xl font-semibold">
              {state?.name || "loading"}
            </h3>
            <div className="flex gap-4 text-lg font-medium justify-center sm:justify-start">
              <h5>{mypics.length} Posts</h5>
              <Link to={`/followerlist/${state?._id}`}>
                <h5>{state?.followers.length || 0} Followers</h5>
              </Link>
              <Link to={`/followinglist/${state?._id}`}>
                <h5>{state?.following.length || 0} Following</h5>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6 w-full max-w-5xl mx-auto px-4">
        {mypics.length > 0 ? (
          mypics.map((item) => (
            <div key={item._id} className="relative">
              <img
                src={item.picture}
                alt={item.title}
                className="h-[350px] w-full object-cover rounded-lg border border-gray-300 shadow-md cursor-pointer"
              />
              <div className="absolute top-2 right-2">
                <FaEllipsisV
                  className="text-white text-2xl cursor-pointer"
                  onClick={() =>
                    setShowMenu(showMenu === item._id ? null : item._id)
                  }
                />
                {showMenu === item._id && (
                  <div className="absolute right-0 bg-white shadow-lg rounded-md p-2">
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                      onClick={() => deletePost(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-lg">No posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
