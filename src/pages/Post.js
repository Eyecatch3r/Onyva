import React, { useEffect, useState } from "react";
import { getPostByID, getPostUrl } from "../services/persistence/post";
import withAuthCheck from "../components/AuthComponent";
import { Link, useParams } from "react-router-dom";
import {
  getPfpUrlByID,
  getPfpUrlByUID,
  getUserByID,
} from "../services/persistence/user";
import { Helmet } from "react-helmet";

function Post() {
  const [imageUrl, setImageUrl] = useState("");
  const [dateString, setDateString] = useState("");
  const [timeString, setTimeString] = useState("");
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const { postId } = useParams();
  const [pfpUrl, setPfpUrl] = useState("");

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
          <div className="">
            <div className="p-4">
              <div className="flex items-center">
                <Link to={`/profile/${post.User}`}>
                  <img
                    className="w-10 h-10 rounded-full mr-4"
                    src={pfpUrl}
                    alt="User"
                  />
                </Link>
                <div>
                  <p className="text-sm font-medium text-secondary">
                    {user.username}
                  </p>
                  <p className="text-xs text-gray-600">
                    {dateString}, {timeString}
                  </p>
                </div>
              </div>
            </div>
            <img
              className="w-full h-96" // Tailwind CSS classes for width and height
              style={{ objectFit: "cover" }} // Inline style for object-fit
              src={imageUrl}
              alt="Post"
            />
            <div className="p-4">
              <div className={"flex justify-center mt-6"}>
                <div className="stat content-center w-fit rounded-lg bg-base-300">
                  <div className="stat-title text-center">Points</div>
                  <div className="stat-value text-center">{post.Score}</div>
                </div>
              </div>
              <p className="text-lg font-semibold mb-2">
                {post["Location Name"]}
              </p>
              <p className="text-sm text-gray-800"></p>
              <div className="flex justify-between items-center mt-4">
                <button className="btn text-gray-600 hover:text-blue-500">
                  Like
                </button>
                <button className="btn text-gray-600 hover:text-blue-500">
                  Comment
                </button>
                <button
                  className="btn text-gray-600 hover:text-blue-500"
                  onClick={async () => {
                    if (navigator.share) {
                      try {
                        await navigator.share({
                          title: post["Location Name"],
                          url: window.location.href,
                        });
                      } catch (error) {
                        console.error(
                          "Something went wrong sharing the blog",
                          error,
                        );
                      }
                    } else {
                      // Fallback for browsers that do not support navigator.share
                      alert("Your browser does not support the share API");
                    }
                  }}
                >
                  Share
                </button>
              </div>
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
