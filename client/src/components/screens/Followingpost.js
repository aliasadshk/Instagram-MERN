/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { userContext } from "../../App";
import { Link } from "react-router-dom";

const Followingpost = () => {
  const [comment, setComment] = useState("");
  const [data, setData] = useState([]);
  const { state } = useContext(userContext);

  let userData = typeof state === "string" ? JSON.parse(state) : state;

  useEffect(() => {
    fetch("http://localhost:2048/followingpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((result) => {
        setData(result.posts);
      });
  }, []);

  const likePost = (id) => {
    fetch("http://localhost:2048/like", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ postId: id }),
    })
      .then((res) => res.json())
      .then((result) => {
        setData((prevData) =>
          prevData.map((item) => (item._id === result._id ? result : item))
        );
      })
      .catch((err) => console.log(err));
  };

  const unlikePost = (id) => {
    fetch("http://localhost:2048/unlike", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ postId: id }),
    })
      .then((res) => res.json())
      .then((result) => {
        setData((prevData) =>
          prevData.map((item) => (item._id === result._id ? result : item))
        );
      })
      .catch((err) => console.log(err));
  };

  const makeComment = (text, postId) => {
    if (comment.trim() !== "") {
      setComment("");
      fetch("http://localhost:2048/comment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({ postId, text }),
      })
        .then((response) => response.json())
        .then((result) => {
          setData((prevData) =>
            prevData.map((item) => (item._id === result._id ? result : item))
          );
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full mt-3">
      {userData.following.length > 0 ? (
        data.map((item) => (
          <div
            className="flex flex-col w-[90%] sm:w-[500px] bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300"
            key={item._id}
          >
            {/* Post Header */}
            <div className="p-4 flex justify-between items-center border-b bg-gray-100">
              <Link
                className="flex items-center gap-3"
                to={
                  item.postedBy._id === userData._id
                    ? "/profile"
                    : `/profile/${item.postedBy._id}`
                }
              >
                <img
                  src={item.postedBy.dp}
                  alt="User DP"
                  className="w-[35px] h-[35px] rounded-full object-cover border border-gray-400"
                />
                <h5 className="font-bold text-gray-900">{item.postedBy.name}</h5>
              </Link>
            </div>

            {/* Post Image */}
            <div className="w-full">
              <img
                src={item.picture}
                alt="Post"
                className="w-full object-cover max-h-[550px]"
              />
            </div>

            {/* Post Footer */}
            <div className="p-4 flex flex-col gap-3">
              {/* Like Button */}
              <div className="flex items-center gap-2">
                {userData && item.likes.includes(userData._id) ? (
                  <MdFavorite
                    className="text-red-600 cursor-pointer text-2xl"
                    onClick={() => unlikePost(item._id)}
                  />
                ) : (
                  <MdFavoriteBorder
                    className="cursor-pointer text-2xl"
                    onClick={() => likePost(item._id)}
                  />
                )}
                <h6 className="text-gray-700">
                  <Link to={`/likeslist/${item._id}`}>{item.likes.length} likes</Link>
                </h6>
              </div>

              {/* Post Title & Description */}
              <h6 className="font-semibold text-gray-900">{item.title}</h6>
              <p className="text-gray-700">{item.body}</p>

              {/* Comments Section */}
              <div className="border-t pt-3">
                {item.comments.map((record) => (
                  <h6 key={record._id || `${record.postedBy.name}-${record.text}`}>
                    <span className="font-semibold text-gray-900">
                      {record.postedBy.name}
                    </span>{" "}
                    - {record.text}
                  </h6>
                ))}
              </div>

              {/* Comment Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                }}
              >
                <div className="w-full flex items-center gap-2 border rounded-full p-2 bg-gray-100">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="flex-1 p-2 text-sm border-none outline-none bg-transparent"
                  />
                  <button
                    onClick={() => makeComment(comment, item._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300"
                  >
                    Comment
                  </button>
                </div>
              </form>
            </div>
          </div>
        ))
      ) : (
        <h4 className="text-center text-gray-600 mt-5">
          You are not following anyone. Follow users to see their posts.
        </h4>
      )}
    </div>
  );
};

export default Followingpost;
