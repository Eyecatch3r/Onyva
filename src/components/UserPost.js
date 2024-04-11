import withAuthCheck from "./AuthComponent";
import React, { useEffect, useState } from "react";
import { getPostUrl, toggleLikePost } from "../services/persistence/post";
import { getPfpUrlByID, getUserByID } from "../services/persistence/user";
import moment from "moment";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

function UserPost({ post }) {
  const [user, setUser] = useState({});
  const [pfpUrl, setPfpUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const { userDetails } = useUser();
  const [Likes, setLikes] = useState(post.Likes);
  useEffect(() => {
    const fetchUserData = async () => {
      const userDetails = await getUserByID(post.User.id);
      setUser(userDetails);
      const url = await getPfpUrlByID(post.User.id);
      setPfpUrl(url);
    };

    const fetchPostUrl = async () => {
      const url = await getPostUrl(post.id);
      setImageUrl(url);
    };

    fetchPostUrl();
    fetchUserData();
  }, [post.User]);

  function handleLike() {
    toggleLikePost(post.id, userDetails.id).then((likeAdded) => {
      if (likeAdded) {
        setLikes((prevLikes) => prevLikes + 1);
      } else
        setLikes((prevLikes) => {
          if (prevLikes > 0) return prevLikes - 1;
          return 0;
        });
    });
  }

  // Assuming post.Timestamp is a Firebase Timestamp
  // Convert Firebase Timestamp to JavaScript Date object, then format
  const postDate = post.Timestamp.toDate();
  const dateString = moment(postDate).format("LL"); // e.g., "September 4, 1986"
  const timeString = moment(postDate).format("LT"); // e.g., "5:00 PM"

  return (
    <div className="card bg-base-200 shadow-xl mx-2 mb-4 animate-fade animate-ease-out">
      <div className="p-4 flex justify-between items-center">
        <Link to={`/profile/${post.User.id}`} className="flex items-center">
          <img
            className="w-10 h-10 rounded-full mr-4"
            src={pfpUrl}
            alt="User"
          />
          <div>
            <p className="text-sm font-medium text-secondary">
              {user.username}
            </p>
            <p className="text-xs text-gray-600">
              {dateString}, {timeString}
            </p>
          </div>
        </Link>
      </div>
      <figure className="overflow-hidden">
        <Link to={`/post/${post.id}`} className="block">
          <img src={imageUrl} alt="Post" className="object-cover w-full" />
        </Link>
      </figure>

      <div className="card-body pb-1">
        <div className={"flex flex-col items-center justify-center"}>
          <h2 className="card-title mb-4 text-base">{post["Location Name"]}</h2>
          <div className="stats max-w-52 shadow">
            <div className="stat">
              <div className="stat-title">Score</div>
              <div className="stat-value text-center">{post.Score}</div>
            </div>
          </div>
        </div>
        <div className="">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={handleLike}
                className="btn text-gray-600 hover:text-blue-500 mr-2"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M15.05 7.044a1.933 1.933 0 0 0-3.407-1.735L8.472 9.75H5.857l-.75.75V18l.75.75h10.964l2.304-4.607A3.554 3.554 0 0 0 15.946 9h-1.548l.652-1.956ZM9.608 10.74l3.256-4.559a.433.433 0 0 1 .763.389l-1.31 3.93h3.63a2.054 2.054 0 0 1 1.836 2.972l-1.889 3.778H9.608v-6.51Zm-1.5 6.51h-1.5v-6h1.5v6Z"
                      fill="currentColor"
                    />
                  </svg>
                </svg>
              </button>
              <span>{Likes}</span>
            </div>
            <button className="btn text-gray-600 hover:text-blue-500">
              Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPost;
