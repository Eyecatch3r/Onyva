import React, { useEffect, useRef, useState } from "react";
import "../App.css";
import { Link, useParams } from "react-router-dom";
import withAuthCheck from "../components/AuthComponent";
import UserPostsList from "../components/UserPostsList";
import {
  getFriendList,
  getPfpUrlByID,
  getUserByID,
  removeFriend,
  updatePfp,
} from "../services/persistence/user";
import { auth } from "../services/firebase";
import { convertToJpg } from "../services/imageService";
import { useUser } from "../contexts/UserContext";
import { Button } from "konsta/react";

function Profile() {
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [userPfpUrl, setUserPfpUrl] = useState("");
  const [friendList, setFriendList] = useState([]);
  const fileInputRef = useRef(null);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  useEffect(() => {
    const fetchProfileDetails = async () => {
      const userData = await getUserByID(userId);
      if (userData) {
        setUserDetails(userData);
        setIsOwnProfile(auth.currentUser?.uid === userData.useruid);
        const pfpUrl = await getPfpUrlByID(userId);
        setUserPfpUrl(pfpUrl);

        const fetchFriendList = async () => {
          const friends = await getFriendList(userData.useruid);
          setFriendList(friends);
        };

        if (userId) {
          fetchFriendList();
        }
      }
    };

    fetchProfileDetails();
  }, [userId]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileConverted = await convertToJpg(file);
      await updatePfp(userId, fileConverted);
      // Optionally, update the profile picture URL in state to reflect the change immediately
      const newPfpUrl = URL.createObjectURL(file);
      setUserPfpUrl(newPfpUrl);
    }
  };

  const handleProfileClick = () => {
    if (isOwnProfile) {
      fileInputRef.current?.click();
    }
  };

  const handleFriendRemove = async (friendId) => {
    await removeFriend(auth.currentUser.uid, friendId);
    setFriendList(friendList.filter((friend) => friend.id !== friendId));
  };

  const getFriendPfp = async (ID) => {
    return await getPfpUrlByID(ID);
  };

  return (
    <div className={"App"}>
      <div className="overflow-y-auto card bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          {isOwnProfile && !auth.currentUser.emailVerified && (
            <div role="alert" className="alert alert-warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Your email is not verified. Please check your inbox and verify
              your email.
            </div>
          )}
          <h1 className="card-title">Profile Info</h1>
          <div className="avatar">
            <div className="relative w-24 overflow-hidden rounded-full transition duration-300 ease-in-out group">
              {isOwnProfile && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
              )}
              <div onClick={handleProfileClick}>
                {userPfpUrl ? (
                  <img
                    src={userPfpUrl}
                    alt="Avatar"
                    className="transform hover:scale-105 transition duration-300 ease-in-out"
                  />
                ) : (
                  <img
                    src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                    alt="Avatar"
                    className="transform hover:scale-105 transition duration-300 ease-in-out"
                  />
                )}
                {isOwnProfile && (
                  <p className="opacity-0 absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-75 group-hover:opacity-100 transition duration-300 ease-in-out">
                    Change Profile Picture
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="stats shadow">
            <div className="stat flex-wrap">
              <div className="stat-title">Score</div>
              <div className="stat-value text-center">
                {userDetails && userDetails.score}
              </div>
            </div>
          </div>
          <table className={"table"}>
            <tbody>
              <tr>
                <td>
                  <p>
                    <div className="badge badge-primary badge-lg mr-2">
                      Username
                    </div>
                    {userDetails && userDetails.username}
                  </p>
                </td>
              </tr>
              {isOwnProfile && (
                <tr>
                  <td>
                    <p>
                      <div className="badge badge-primary badge-lg mr-2">
                        E-Mail Address
                      </div>
                      <span>{auth.currentUser.email}</span>
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card bg-base-100 shadow-xl items-center text-center">
        <div>
          <button
            className={"btn m-2.5"}
            onClick={() => setShowFriendsList(!showFriendsList)}
          >
            <svg
              fill="#7f8ce8"
              width="30px"
              height="30px"
              viewBox="0 -6 44 44"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid"
            >
              <path d="M42.001,32.000 L14.010,32.000 C12.908,32.000 12.010,31.104 12.010,30.001 L12.010,28.002 C12.010,27.636 12.211,27.300 12.532,27.124 L22.318,21.787 C19.040,18.242 19.004,13.227 19.004,12.995 L19.010,7.002 C19.010,6.946 19.015,6.891 19.024,6.837 C19.713,2.751 24.224,0.007 28.005,0.007 C28.006,0.007 28.008,0.007 28.009,0.007 C31.788,0.007 36.298,2.749 36.989,6.834 C36.998,6.889 37.003,6.945 37.003,7.000 L37.006,12.994 C37.006,13.225 36.970,18.240 33.693,21.785 L43.479,27.122 C43.800,27.298 44.000,27.634 44.000,28.000 L44.000,30.001 C44.000,31.104 43.103,32.000 42.001,32.000 ZM31.526,22.880 C31.233,22.720 31.039,22.425 31.008,22.093 C30.978,21.761 31.116,21.436 31.374,21.226 C34.971,18.310 35.007,13.048 35.007,12.995 L35.003,7.089 C34.441,4.089 30.883,2.005 28.005,2.005 C25.126,2.006 21.570,4.091 21.010,7.091 L21.004,12.997 C21.004,13.048 21.059,18.327 24.636,21.228 C24.895,21.438 25.033,21.763 25.002,22.095 C24.972,22.427 24.778,22.722 24.485,22.882 L14.010,28.596 L14.010,30.001 L41.999,30.001 L42.000,28.595 L31.526,22.880 ZM18.647,2.520 C17.764,2.177 16.848,1.997 15.995,1.997 C13.116,1.998 9.559,4.083 8.999,7.083 L8.993,12.989 C8.993,13.041 9.047,18.319 12.625,21.220 C12.884,21.430 13.022,21.755 12.992,22.087 C12.961,22.419 12.767,22.714 12.474,22.874 L1.999,28.588 L1.999,29.993 L8.998,29.993 C9.550,29.993 9.997,30.441 9.997,30.993 C9.997,31.545 9.550,31.993 8.998,31.993 L1.999,31.993 C0.897,31.993 -0.000,31.096 -0.000,29.993 L-0.000,27.994 C-0.000,27.629 0.200,27.292 0.521,27.117 L10.307,21.779 C7.030,18.234 6.993,13.219 6.993,12.988 L6.999,6.994 C6.999,6.939 7.004,6.883 7.013,6.829 C7.702,2.744 12.213,-0.000 15.995,-0.000 C15.999,-0.000 16.005,-0.000 16.010,-0.000 C17.101,-0.000 18.262,0.227 19.369,0.656 C19.885,0.856 20.140,1.435 19.941,1.949 C19.740,2.464 19.158,2.720 18.647,2.520 Z" />
            </svg>
          </button>
          {showFriendsList && (
            <div className="overflow-auto" style={{ paddingBottom: "50px" }}>
              <div className="divider divider-primary">Friends</div>
              <table className="table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Username</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {friendList.map((friend, index) => (
                    <tr
                      className={
                        "transition hover:bg-opacity-30 hover:bg-gray-100"
                      }
                      key={index}
                    >
                      <td className={"rounded-l-3xl"}>
                        <Link to={`/profile/${friend.id}`} key={index}>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="mask mask-squircle w-12 h-12">
                                <img
                                  src={
                                    getFriendPfp(friend.id) &&
                                    "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                                  }
                                  alt="Avatar"
                                />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className={"text-center"}>
                        {friend.data().username}
                        <Link to={`/profile/${friend.id}`} key={index} />
                      </td>
                      <td
                        className={
                          isOwnProfile
                            ? "text-center"
                            : "rounded-r-3xl text-center"
                        }
                      >
                        {friend.data().score}
                        <Link to={`/profile/${friend.id}`} key={index} />
                      </td>
                      {isOwnProfile && (
                        <td className={"rounded-r-3xl"}>
                          <Button
                            onClick={() => handleFriendRemove(friend.id)}
                            className="btn btn-primary btn-sm"
                          >
                            Remove friend
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <div className="divider divider-primary">User Posts</div>
      {userDetails && (
        <UserPostsList user={userDetails} userId={userId}></UserPostsList>
      )}
    </div>
  );
}

export default withAuthCheck(Profile);
