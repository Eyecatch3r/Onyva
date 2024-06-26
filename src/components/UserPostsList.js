import React, { useEffect, useState } from "react";
import { getPostsByUserID } from "../services/persistence/user";
import { Link } from "react-router-dom";
import UserPost from "./UserPost";

function UserPostsList({ userId }) {
  const [posts, setPosts] = useState([]);
  const [sortPreference, setSortPreference] = useState("timestamp");
  const [isLoading, setIsLoading] = useState(true); // New state for loading status

  async function getPosts() {
    setIsLoading(true); // Start loading
    const listPosts = await getPostsByUserID(userId);
    // Assuming listPosts.docs is an array of posts
    setPosts(listPosts.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setIsLoading(false); // Finish loading
  }

  useEffect(() => {
    getPosts();
  }, [userId]);

  // Sort posts based on the current preference
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortPreference === "score") {
      return b.Score - a.Score;
    }
    return b.Timestamp.toDate() - a.Timestamp.toDate();
  });

  return (
    <div className={"overflow-y-auto"} style={{ paddingBottom: "50px" }}>
      <div className="form-control">
        <label className="label">
          <span className="ml-4 label-text font-bold">Sort By</span>
        </label>
        <select
          className="ml-6 mb-4 select select-ghost w-full max-w-xs"
          value={sortPreference}
          onChange={(e) => setSortPreference(e.target.value)}
        >
          <option value="timestamp">Timestamp</option>
          <option value="score">Score</option>
        </select>
      </div>
      {
        isLoading ? (
          <div>
            <div className="skeleton flex flex-col gap-4 w-52 mb-4">
              <div className="flex gap-4 items-center">
                <div className="skeleton w-16 h-16 rounded-full shrink-0"></div>
                <div className="flex flex-col gap-4">
                  <div className="skeleton h-4 w-20"></div>
                  <div className="skeleton h-4 w-28"></div>
                </div>
              </div>
            </div>

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
        ) : posts.length > 0 ? (
          sortedPosts.map((post) => (
            <div className={"overflow-x-auto"} key={post.id}>
              <UserPost post={post} />
            </div>
          ))
        ) : null /* Do not display anything if not loading and no posts */
      }
    </div>
  );
}

export default UserPostsList;
