/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../../App";
import { Link, useParams } from "react-router-dom";

const Followinglist = () => {
  const { id } = useParams();
  const { state, dispatch } = useContext(userContext);
  const [followingData, setFollowingData] = useState([]);

  useEffect(() => {
    fetchList();
  }, []);

  //Sends a GET request to fetch the list of users that the logged-in user follows.


  const fetchList = () => {
    fetch(`http://localhost:2048/followinglist/${id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((result) => {
        setFollowingData(result.result);
      });
  };

  //Sends a PUT request to /unfollow with the userid in the request body.


  const unfollowUser = (userid) => {
    fetch("http://localhost:2048/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ unfollowId: userid }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        await dispatch({ type: "UPDATE", payload: { following: data.currentUser.following, followers: data.currentUser.followers } });
        localStorage.setItem("user", JSON.stringify(data.currentUser));
      });
  };

  const followUser = (userid) => {
    fetch("http://localhost:2048/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ followId: userid }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        await dispatch({ type: "UPDATE", payload: { following: data.currentUser.following, followers: data.currentUser.followers } });
        localStorage.setItem("user", JSON.stringify(data.currentUser));
      });
  };


  //Rendering List

  return (
    <div className="flex flex-col items-center w-full mt-3">
      <h3 className="text-center font-medium sm:text-3xl text-2xl bg-gray-50 mt-1 py-2">Following</h3>
      {followingData.length ? (
        followingData.map((item) => (
          <div key={item._id} className="flex justify-between items-center w-[90%] sm:w-[500px] bg-white shadow-md border border-gray-300 rounded-lg p-4 mt-2">
            <Link to={state._id === item._id ? `/profile` : `/profile/${item._id}`} className="flex items-center gap-3">
              <img src={item.dp} alt="dp" className="w-[40px] h-[40px] rounded-full border border-gray-400 object-cover" />
              <h5 className="font-bold">{item.name}</h5>
            </Link>
            {state._id !== item._id && (
              state.following.includes(item._id) ? (
                <button className="bg-gray-200 text-green-600 px-4 py-2 rounded-lg shadow-sm" onClick={() => unfollowUser(item._id)}>
                  Following
                </button>
              ) : (
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-sm" onClick={() => followUser(item._id)}>
                  Follow
                </button>
              )
            )}
          </div>
        ))
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  );
};

export default Followinglist;