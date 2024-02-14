import React, { useEffect, useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";
import { auth, signOutAccount } from "../services/firebase";
import {
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

  async function fetchData() {
    const currentUser = await getUserByUID(auth.currentUser.uid);
    setUser(currentUser);
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Use score directly from currentUser after it's set
  useEffect(() => {
    async function fetchUserData() {
      if (user) {
        const url = await getPfpUrlByID(user.id);
        setImageUrl(url);
        setScore(user.data().score);
      }
    }

    fetchUserData();
  }, [user]);

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
      <div className="navbar-end">
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
