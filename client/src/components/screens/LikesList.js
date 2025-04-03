/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { MdFavorite } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { userContext } from "../../App";

const LikesList = () => {
  const { postid } = useParams();
  const [userData, setUserData] = useState([]);
  const { state, dispatch } = useContext(userContext);
  const [search, setSearch] = useState("");
  const [searchedData, setSearchedData] = useState([]);

  const fetchList = () => {
    fetch(`http://localhost:2048/likeslist/${postid}`, {
      method: "get",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.err) {
          toast.error(data.err);
        } else {
          setUserData(data);
        }
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchList();
  }, []);

  const searchUser = (query) => {
    setSearch(query);
    if (query !== "") {
      const data = userData.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchedData(data);
    } else {
      setSearchedData([]);
      fetchList();
    }
  };

  const followUser = (userid) => {
    fetch("http://localhost:2048/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        await dispatch({
          type: "UPDATE",
          payload: {
            following: data.currentUser.following,
            followers: data.currentUser.followers,
          },
        });
        localStorage.setItem("user", JSON.stringify(data.currentUser));
      });
  };

  const unfollowUser = (userid) => {
    fetch("http://localhost:2048/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        await dispatch({
          type: "UPDATE",
          payload: {
            following: data.currentUser.following,
            followers: data.currentUser.followers,
          },
        });
        localStorage.setItem("user", JSON.stringify(data.currentUser));
      });
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center mt-2">
      <h3 className="flex justify-center items-center font-medium sm:text-3xl text-2xl bg-gray-50 mt-1 py-2">
        <MdFavorite className="text-black text-3xl mr-2" /> {userData.length}
      </h3>

      {userData.length > 0 && (
        <div className="flex justify-center items-center w-full">
          <input
            className="border-2 border-gray-400 py-2 px-4 outline-none my-2 h-fit sm:w-[500px] w-[90%] focus:border-blue-500 rounded-md"
            type="text"
            placeholder="Search User..."
            value={search}
            onChange={(e) => searchUser(e.target.value)}
          />
        </div>
      )}

      {(!searchedData.length ? userData : searchedData).map((item) => (
        <div
          key={item._id}
          className="w-[90%] sm:w-[500px] bg-white shadow-md border border-gray-300 rounded-lg flex justify-between items-center py-3 px-4 mt-2"
        >
          <Link
            to={state._id === item._id ? `/profile` : `/profile/${item._id}`}
            className="flex items-center gap-3"
          >
            <img
              src={item.dp}
              alt="dp"
              className="w-[40px] h-[40px] rounded-full object-cover border border-gray-400"
            />
            <h5 className="font-medium">{item.name}</h5>
          </Link>

          {state._id !== item._id &&
            (state.following.includes(item._id) ? (
              <button
                className="bg-gray-200 text-green-600 px-4 py-2 rounded-lg shadow-sm"
                onClick={() => unfollowUser(item._id)}
              >
                Following
              </button>
            ) : (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-sm"
                onClick={() => followUser(item._id)}
              >
                Follow
              </button>
            ))}
        </div>
      ))}
    </div>
  );
};

export default LikesList;
