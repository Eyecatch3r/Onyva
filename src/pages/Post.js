import React, { useEffect, useState } from "react";
import {
  getPostByID,
  getPostUrl,
  toggleLikePost,
} from "../services/persistence/post";
import withAuthCheck from "../components/AuthComponent";
import { Link, useParams } from "react-router-dom";
import {
  getPfpUrlByID,
  getPfpUrlByUID,
  getUserByID,
} from "../services/persistence/user";
import { Helmet } from "react-helmet";
import { useUser } from "../contexts/UserContext";

function Post() {
  const [imageUrl, setImageUrl] = useState("");
  const [dateString, setDateString] = useState("");
  const [timeString, setTimeString] = useState("");
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const { postId } = useParams();
  const [pfpUrl, setPfpUrl] = useState("");
  const { userDetails } = useUser();
  useEffect(() => {
    async function fetchPost() {
      const post = await getPostByID(postId);
      setPost(post);
      const url = await getPostUrl(postId);
      setImageUrl(url);
    }

    fetchPost();
  }, [postId]);

  useEffect(() => {
    async function fetchUser() {
      if (post && post.User) {
        console.log(post.User);
        const userData = await getUserByID(post.User.id);
        setUser(userData);

        const pfpUrl = await getPfpUrlByID(post.User.id);
        setPfpUrl(pfpUrl);
      }
    }

    if (post) {
      console.log(post);
      const date = new Date(post.Timestamp.seconds * 1000);
      setDateString(date.toLocaleDateString());
      setTimeString(date.toLocaleTimeString());
      fetchUser();
    }
  }, [post]);

  function handleLike() {
    toggleLikePost(postId, userDetails.id).then((likeAdded) => {
      if (likeAdded) {
        setPost((prevPost) => ({
          ...prevPost,
          Likes: prevPost.Likes + 1,
          LikedBy: [...prevPost.LikedBy, userDetails.id],
        }));
      } else
        setPost((prevPost) => ({
          ...prevPost,
          Likes: prevPost.Likes - 1,
          LikedBy: prevPost.LikedBy.filter((id) => id !== userDetails.id),
        }));
    });
  }

  return (
    <div
      style={{ paddingBottom: "50px" }}
      className="card max-w-xl my-3 mx-auto bg-base-200 shadow-md rounded-md overflow-hidden"
    >
      {post && user ? (
        <div>
          <Helmet>
            <title>{post["Location Name"]}</title>
            <meta property="og:title" content={post["Location Name"]} />
            <meta property="og:description" content="Description of the post" />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:url" content={window.location.href} />
          </Helmet>
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
            <p className="text-lg font-semibold mb-0">
              {post["Location Name"]}
            </p>
          </div>
          <img
            className="w-full h-96 object-cover" // Adjusted for consistency
            src={imageUrl}
            alt="Post"
          />
          <div className="flex justify-center mt-6">
            <div className="stat content-center w-fit rounded-lg bg-base-300">
              <div className="stat-title text-center">Points</div>
              <div className="stat-value text-center">{post.Score}</div>
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
                <span>{post.Likes}</span>
              </div>
              <button className="btn text-gray-600 hover:text-blue-500">
                Comment
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={"flex justify-center"}>
          <div className="skeleton flex flex-col gap-4 w-52 mb-4">
            <div className="flex gap-4 items-center">
              <div className="skeleton w-16 h-16 rounded-full shrink-0"></div>
              <div className="flex flex-col gap-4">
                <div className="skeleton h-4 w-20"></div>
                <div className="skeleton h-4 w-28"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAuthCheck(Post);
