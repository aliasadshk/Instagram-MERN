import React, { useContext, useEffect, useState } from "react";
import { MdFavorite, MdFavoriteBorder, MdDelete } from "react-icons/md";
import { userContext } from "../../App";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const { state } = useContext(userContext);

  useEffect(() => {
    fetch("http://localhost:2048/allpost", {
      headers: { Authorization: "Bearer " + localStorage.getItem("jwt") },
    })
      .then((res) => res.json())
      .then((result) => setData(result.posts));
  }, []);

  const updatePost = (url, postId, body = {}) => {
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ postId, ...body }),
    })
      .then((res) => res.json())
      .then((result) =>
        setData((prev) =>
          prev.map((item) => (item._id === result._id ? result : item))
        )
      )
      .catch((err) => console.log(err));
  };

  const deletePost = (postId) => {
    fetch(`http://localhost:2048/deletepost/${postId}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + localStorage.getItem("jwt") },
    })
      .then((res) => res.json())
      .then((result) => {
        setData((prev) =>
          prev.filter((item) => item._id !== result.deletedPostDetails._id)
        );
        toast.success(result.Message);
      })
      .catch((err) => toast.error(err));
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full mt-3">
      {data.map((item) => (
        <div
          key={item._id}
          className="flex flex-col w-[90%] sm:w-[500px] bg-white shadow-lg rounded-lg border border-gray-300"
        >
          <div className="p-4 flex justify-between items-center border-b bg-gray-100">
            <Link
              to={
                item.postedBy._id === state._id
                  ? "/profile"
                  : `/profile/${item.postedBy._id}`
              }
              className="flex items-center gap-3"
            >
              <img
                src={item.postedBy.dp}
                alt="User DP"
                className="w-[35px] h-[35px] rounded-full border border-gray-400"
              />
              <h5 className="font-bold">{item.postedBy.name}</h5>
            </Link>
            {state && item.postedBy._id === state._id && (
              <MdDelete
                className="text-red-600 cursor-pointer text-2xl"
                onClick={() => deletePost(item._id)}
              />
            )}
          </div>
          <img
            src={item.picture}
            alt="Post"
            className="w-full max-h-[550px] object-cover"
          />
          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              {state && item.likes.includes(state._id) ? (
                <MdFavorite
                  className="text-red-600 cursor-pointer text-2xl"
                  onClick={() =>
                    updatePost("http://localhost:2048/unlike", item._id)
                  }
                />
              ) : (
                <MdFavoriteBorder
                  className="cursor-pointer text-2xl"
                  onClick={() =>
                    updatePost("http://localhost:2048/like", item._id)
                  }
                />
              )}
              <h6>
                <Link to={`/likeslist/${item._id}`}>
                  {item.likes.length} likes
                </Link>
              </h6>
            </div>
            <h6 className="font-semibold">{item.title}</h6>
            <p>{item.body}</p>
            <div className="border-t pt-3">
              {item.comments.map((record) => (
                <h6 key={record._id}>
                  <span className="font-semibold">{record.postedBy.name}</span>{" "}
                  - {record.text}
                </h6>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updatePost("http://localhost:2048/comment", item._id, {
                  text: comment,
                });
                setComment("");
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
                  type="submit"
                  className="bg-blue-500 text-white px-3 py-3 rounded-full"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
