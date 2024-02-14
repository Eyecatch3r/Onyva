import "../App.css";
import { auth } from "../services/firebase";
import {
  updatePfp,
  getFriendList,
  getUserByID,
  getPfpUrlByID,
} from "../services/persistence/user";
import { useEffect, useRef, useState } from "react";
import withAuthCheck from "../components/AuthComponent";
import { convertToJpg } from "../services/imageService";
import { useParams } from "react-router-dom";

function Profile() {
  const { userId } = useParams();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [friendsList, setFriendList] = useState([]);
  const fileInputRef = useRef(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileConverted = await convertToJpg(file);
      return await updatePfp(userId, file);
    }
  };

  const handleProfileClick = () => {
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const url = await getPfpUrlByID(userId);

        if (url) {
          setImageUrl(url);
        }
        const user = await getUserByID(userId);
        if (user) {
          setUsername(user.username);
          setIsOwnProfile(user.useruid === auth.currentUser.uid);
        }

        setEmailVerified(auth.currentUser.emailVerified);

        const friends = await getFriendList(auth.currentUser.uid);
        if (friends) {
          setFriendList(friends.docs);
        }
      } catch (error) {
        // Handle errors if needed
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [userId]); // Empty dependency array to run this effect only once (on mount)

  useEffect(() => {
    if (isOwnProfile) {
      setEmail(auth.currentUser.email);
    }
  }, [isOwnProfile]); // This effect runs whenever `isOwnProfile` changes
  return (
    <div className={"App"}>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          {isOwnProfile && !emailVerified && (
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
                {imageUrl ? (
                  <img
                    src={imageUrl}
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
          <table className={"table"}>
            <tbody>
              <tr>
                <td>
                  <p>
                    <div className="badge badge-primary badge-lg mr-2">
                      Username
                    </div>
                    {username}
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
                      <span>{email}</span>
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
          <h1 className={"card-title"}>Friends List</h1>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {friendsList.map((friend, index) => (
                  <tr key={index}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img src={""} alt="Avatar" />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{friend.username}</div>
                          <div className="text-sm opacity-50">
                            {friend.country}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {friend.job}
                      <br />
                      <span className="badge badge-ghost badge-sm">
                        {friend.jobTitle}
                      </span>
                    </td>
                    <td>{friend.favoriteColor}</td>
                    <td>
                      <button className="btn btn-ghost btn-xs">Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuthCheck(Profile);
