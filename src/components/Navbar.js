import React, { useEffect, useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";
import { auth, signOutAccount } from "../services/firebase";
import {
  deleteNotificationByIndex,
  getNotificationsByUID,
  getPfpUrlByID,
  getPfpUrlByUID,
  getUserByID,
  getUserByUID,
} from "../services/persistence/user";
import withAuthCheck from "./AuthComponent";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [score, setScore] = useState(null);
  const [notifications, setNotifications] = useState([]);

  async function fetchData() {
    const currentUser = await getUserByUID(auth.currentUser.uid);
    setUser(currentUser);
  }

  useEffect(() => {
    console.log("Navbar mounted");
    fetchData();
  }, []);

  // Use score directly from currentUser after it's set
  useEffect(() => {
    async function fetchUserData() {
      if (user) {
        const url = await getPfpUrlByID(user.id);
        setImageUrl(url);
        setScore(user.data().score);
        const userNotifications = user.data().notifications;
        setNotifications(userNotifications);
        console.log("User fetched");
      }
    }

    fetchUserData();
  }, [user]);

  function handleNotificationDelete(index) {
    deleteNotificationByIndex(user.id, index);
  }

  return (
    <div className="navbar bg-base-200">
      <div className="navbar-start">
        <Link to={"/"} className="btn btn-ghost text-xl">
          onYva
        </Link>
      </div>
      <div className="navbar-center">
        <div className="stats shadow">
          <div className="stat flex-wrap">
            <div className="stat-title">Score</div>
            <div className="stat-value text-center">{score}</div>
          </div>
        </div>
      </div>
      <div className="navbar-end ml-2">
        <div
          className={"lg:tooltip dropdown dropdown-bottom dropdown-end mx-2"}
          data-tip="Notifications"
        >
          <button className="btn" role={"button"}>
            <div style={{ position: "relative" }}>
              <svg
                style={{ position: "relative", zIndex: 2 }}
                width="20px"
                height="20px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.00195 17H5.60636C4.34793 17 3.71872 17 3.58633 16.9023C3.4376 16.7925 3.40126 16.7277 3.38515 16.5436C3.37082 16.3797 3.75646 15.7486 4.52776 14.4866C5.32411 13.1835 6.00031 11.2862 6.00031 8.6C6.00031 7.11479 6.63245 5.69041 7.75766 4.6402C8.88288 3.59 10.409 3 12.0003 3C13.5916 3 15.1177 3.59 16.2429 4.6402C17.3682 5.69041 18.0003 7.11479 18.0003 8.6C18.0003 11.2862 18.6765 13.1835 19.4729 14.4866C20.2441 15.7486 20.6298 16.3797 20.6155 16.5436C20.5994 16.7277 20.563 16.7925 20.4143 16.9023C20.2819 17 19.6527 17 18.3943 17H15.0003M9.00195 17L9.00031 18C9.00031 19.6569 10.3435 21 12.0003 21C13.6572 21 15.0003 19.6569 15.0003 18V17M9.00195 17H15.0003"
                  stroke="#7f8ce8"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              {notifications.length !== 0 && (
                <div
                  className="badge"
                  style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-12px",
                    zIndex: 1,
                  }}
                >
                  {notifications.length}
                </div>
              )}
            </div>
            <div className="dropdown dropdown-end">
              <ul className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                {notifications.length !== 0 &&
                  notifications.map((notification, index) => (
                    <li key={index}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <p>{notification}</p>
                        <button
                          onClick={() => handleNotificationDelete(index)}
                          className="btn btn-circle btn-outline w-5 h-5 min-h-0 min-w-0"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </button>
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              {imageUrl ? (
                <img alt="User Avatar" src={imageUrl} />
              ) : (
                <img
                  alt="Default Avatar"
                  src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                />
              )}
            </div>
          </div>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            {user && (
              <li>
                <Link
                  className="justify-between"
                  to={{ pathname: `/profile/${user.id}` }}
                >
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
            )}
            <li>
              <Link to={"/settings"}>Settings</Link>
            </li>
            <li>
              <p onClick={signOutAccount}>Sign Out</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
