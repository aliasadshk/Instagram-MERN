  /* eslint-disable react-hooks/exhaustive-deps */
  import React, { useContext, useEffect, useState } from "react";
  import { userContext } from "../../App";
  import { Link, useParams } from "react-router-dom";

  const Followerlist = () => {
    const { id } = useParams();
    const { state, dispatch } = useContext(userContext);
    const [search, setSearch] = useState("");
    const [followerData, setFollowerData] = useState([]);
    const [removeFollower, setRemoveFollower] = useState(false);
    const [searchedData, setSearchedData] = useState([]);

    useEffect(() => {
      fetchList();
    }, []);

    const fetchList = () => {
      fetch(`http://localhost:2048/followerlist/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((response) => response.json())
        .then((result) => setFollowerData(result.result));
    };

    const searchUser = (query) => {
      setSearch(query);
      if (query !== "") {
        const data = followerData.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        );
        setSearchedData(data);
      } else {
        setSearchedData([]);
        fetchList();
      }
    };

    const remove = (followerId) => {
      fetch("http://localhost:2048/removeFollower", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({ followerId }),
      })
        .then((res) => res.json())
        .then(async (result) => {
          await dispatch({
            type: "UPDATE",
            payload: {
              following: result.currentUser.following,
              followers: result.currentUser.followers,
            },
          });
          localStorage.setItem("user", JSON.stringify(result.currentUser));
          setRemoveFollower(true);
        });
    };

    useEffect(() => {
      if (removeFollower) {
        fetchList();
      }
    }, [removeFollower]);

    return (
      <div className="w-full h-screen flex flex-col items-center p-4">
        <h3 className="text-center font-medium text-2xl bg-gray-50 py-3 w-full">
          Followers
        </h3>
        {followerData.length > 0 && (
          <input
            className="border-2 border-gray-400 py-2 px-4 my-3 w-[90%] sm:w-[500px] focus:border-blue-500 rounded-md outline-none"
            type="text"
            placeholder="Search User..."
            value={search}
            onChange={(e) => searchUser(e.target.value)}
          />
        )}
        <div className="w-full flex flex-col items-center gap-3">
          {(searchedData.length > 0 ? searchedData : followerData).map(
            (item) => (
              <div
                key={item._id}
                className="flex justify-between items-center w-[90%] sm:w-[500px] bg-white shadow-md border border-gray-300 p-4 rounded-lg"
              >
                <Link
                  className="flex items-center gap-4"
                  to={state._id === item._id ? `/profile` : `/profile/${item._id}`}
                >
                  <img
                    src={item.dp}
                    alt="dp"
                    className="w-[40px] h-[40px] rounded-full object-cover border border-gray-400"
                  />
                  <h5 className="text-lg font-medium">{item.name}</h5>
                </Link>
                {id === state._id && (
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                    onClick={() => remove(item._id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            )
          )}
        </div>
      </div>
    );
  };

  export default Followerlist;
