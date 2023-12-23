import withAuthCheck from "./AuthComponent";
import React, { useEffect, useState } from "react";
import { getPostUrl } from "../services/persistence/post";

function UserPost({ post }) {
  const [imageUrl, setImageUrl] = useState("");

  const postData = post.data();
  useEffect(() => {
    async function fetchImageUrl() {
      const url = await getPostUrl(post.id);
      setImageUrl(url);
    }

    fetchImageUrl();
  }, [post.id]);

  const date = new Date(postData.Timestamp.seconds * 1000);
  const dateString = date.toLocaleDateString();
  const timeString = date.toLocaleTimeString();
  return (
    <div className="card card-side bg-base-200 shadow-xl mx-2 mb-4">
      <figure>
        <img src={imageUrl} alt="Post" className="object-contain" />
      </figure>

      <div className="card-body">
        <h2 className="card-title">{postData["Location Name"]}</h2>
        <div className="stats shadow">
          <div className="stat flex-wrap">
            <div className="stat-title">Score</div>
            <div className="stat-value text-center">{postData.Score}</div>
          </div>
        </div>
        <p>
          {dateString}, {timeString}
        </p>
      </div>
    </div>
  );
}

export default UserPost;
