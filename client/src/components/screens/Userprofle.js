import React, { useEffect, useState, useContext } from "react";
import { userContext } from "../../App";
import { Link, useParams, useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { state, dispatch } = useContext(userContext);
  const [userProfile, setUserProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const { userid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:2048/user/${userid}`, {
          headers: { Authorization: "Bearer " + localStorage.getItem("jwt") },
        });
        const data = await res.json();
        setUserProfile(data);

        // Check if logged-in user follows this profile
        const currentUser = JSON.parse(localStorage.getItem("user"));
        setIsFollowing(currentUser.following.includes(userid));
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [userid]);

  const handleFollow = async () => {
    try {
      const res = await fetch(`http://localhost:2048/${isFollowing ? "unfollow" : "follow"}`, {
        method: "PUT",
        headers: {        
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({ followId: userid }),
      });

      const data = await res.json();
      dispatch({ type: "UPDATE", payload: data.currentUser });
      localStorage.setItem("user", JSON.stringify(data.currentUser));
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Error updating follow status:", err);
    }
  };

  if (!userProfile) return <h2 className="text-center mt-10">Loading...</h2>;

  return (
    <div className="flex flex-col gap-6 px-4">
      <div className="flex flex-col gap-4 border-b-2 md:w-[85%] w-full mx-auto py-6">
        <div className="flex items-center sm:flex-row flex-col justify-center lg:gap-20 md:gap-10 gap-6">
          <div className="relative">
            <img
              src={userProfile?.user?.dp || "https://via.placeholder.com/150"}
              alt="profile"
              className="sm:w-[200px] sm:h-[200px] w-[150px] h-[150px] rounded-full object-cover border-4 border-gray-300"
            />
          </div>
          <div className="flex flex-col gap-3 text-center sm:text-left">
            <h3 className="text-3xl sm:text-4xl font-semibold">
              {userProfile?.user?.name}
            </h3>
            <div className="flex gap-4 text-lg font-medium justify-center sm:justify-start">
              <h5>{userProfile?.posts?.length} Posts</h5>
              <Link to={`/followerlist/${userid}`}>
                <h5>{userProfile?.user?.followers?.length} Followers</h5>
              </Link>
              <Link to={`/followinglist/${userid}`}>
                <h5>{userProfile?.user?.following?.length} Following</h5>
              </Link>
            </div>

            {/* Show Follow/Unfollow button only for other users */}
            {state._id !== userid && (
              <>
                <button
                  onClick={handleFollow}
                  className={`mt-3 px-4 py-2 rounded ${
                    isFollowing ? "bg-green-300 text-black" : "bg-blue-500 text-white"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
                <button
                  onClick={() => navigate(`/message/${userid}`)}
                  className="mt-3 px-4 py-2 rounded bg-gray-500 text-white"
                >
                  Message
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
