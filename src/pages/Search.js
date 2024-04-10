import withAuthCheck from "../components/AuthComponent";
import { Link } from "react-router-dom";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  addFriend,
  getFriendList,
  getPfpUrlByID,
  getUserByID,
  getUsers,
} from "../services/persistence/user";
import { auth } from "../services/firebase";
import { Ripple, initTE } from "tw-elements";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const inputRef = useRef();
  const [friendList, setFriendList] = useState([]);

  initTE({ Ripple });
  const getPreferredScheme = () =>
    window?.matchMedia?.("(prefers-color-scheme:dark)")?.matches
      ? "dark"
      : "light";

  useEffect(() => {
    fetchFriendList();
  }, []);

  const fetchFriendList = async () => {
    const friends = await getFriendList(auth.currentUser.uid);
    setFriendList(friends);
  };

  const addFriendButtonRefs = useRef({});

  const handleAddFriend = async (friendId) => {
    await addFriend(auth.currentUser.uid, friendId);
    await fetchFriendList(); // Refresh the friend list
    if (addFriendButtonRefs.current[friendId]) {
      addFriendButtonRefs.current[friendId].style.display = "none"; // Hide the button
    }
  };
  const getUserPfp = async (ID) => {
    const url = await getPfpUrlByID(ID);
    return url;
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    getUsers(value).then((users) => {
      // Modify getUsers to accept 'page' and 'pageSize'
      setUserResults(users);
    });
  };

  const handleNext = () => {
    setPage(page + 1);
    handleSearch(searchTerm);
  };

  const handlePrevious = () => {
    setPage(page - 1);
    handleSearch(searchTerm);
  };

  return (
    <div>
      <div className="flex justify-center relative m-3">
        <input
          ref={inputRef}
          type="search"
          className=" peer block min-h-[auto] w-10/12 rounded border-0 border-primary px-3 py-[0.32rem] leading-[1.6] outline-0 outline-primary transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0 backdrop-filter[blur] bg-gray-200 dark:bg-gray-800 border-opacity-18 focus:border-blue-500"
          id="exampleSearch2"
          placeholder="Type query"
        />
        <label
          form="exampleSearch2"
          className="text-opacity-40 pointer-events-none relative -left-24 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary ml-3"
        >
          Search
        </label>
        <button
          onClick={() => {
            handleSearch(inputRef.current.value);
          }}
          data-te-ripple-init
          data-te-ripple-centered="true"
          className="bg-primary relative px-3 py-2 -left-4 bg-none text-white  rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div className="m-3 divider divider-primary">Results</div>
      <div className="flex justify-center m-3 overflow-auto">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Username</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {userResults
              .slice(page * pageSize, (page + 1) * pageSize)
              .map((user, index) => (
                <tr
                  className={
                    getPreferredScheme() === "light"
                      ? "ripple-bg-gray-300"
                      : "ripple-bg-gray-900"
                  }
                  key={index}
                >
                  <td className={"rounded-l-3xl"}>
                    <a href={`/profile/${user.id}`} key={index}>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img
                              src={
                                getUserPfp(user.id) &&
                                "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                              }
                              alt="Avatar"
                            />
                          </div>
                        </div>
                      </div>
                    </a>
                  </td>
                  <td className={""}>
                    {user.data().username}
                    <Link to={`/profile/${user.id}`} key={index} />
                  </td>
                  <td className={"rounded-r-3xl "}>
                    {user.data().score}
                    <Link to={`/profile/${user.id}`} key={index} />
                    {user.id !== auth.currentUser.uid &&
                    !friendList.some(
                      (friendRef) => friendRef.id === user.id,
                    ) ? (
                      <button
                        ref={(el) =>
                          (addFriendButtonRefs.current[user.id] = el)
                        }
                        className={"ml-3 btn btn-xs"}
                        onClick={() => handleAddFriend(user.id)}
                      >
                        Add Friend
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={handlePrevious}
        className={"m-3 btn btn-outline btn-primary"}
        disabled={page === 0}
      >
        Previous
      </button>
      <button
        onClick={handleNext}
        className={"btn btn-outline btn-primary"}
        disabled={userResults.length < pageSize}
      >
        Next
      </button>
    </div>
  );
}

export default withAuthCheck(Search);
