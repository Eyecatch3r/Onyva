import React, { useEffect, useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";
import { auth, signOutAccount } from "../services/firebase";
import { getPfpUrl } from "../services/persistence/user";
import withAuthCheck from "./AuthComponent";

const Navbar = () => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    async function fetchdata() {
      const url = await getPfpUrl(auth.currentUser.uid);
      if (url) {
        setImageUrl(url);
      }
    }

    fetchdata();
  }, []);
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link to={"/"} className="btn btn-ghost text-xl">
          onYva
        </Link>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
          />
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              {imageUrl ? (
                <img alt="Tailwind CSS Navbar component" src={imageUrl} />
              ) : (
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                />
              )}
            </div>
          </div>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a className="justify-between" href={"/profile"}>
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <Link to={"/Settings"}>Settings</Link>
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

export default withAuthCheck(Navbar);
