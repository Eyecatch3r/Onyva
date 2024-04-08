import UserPost from "./UserPost";
import { useEffect, useState } from "react";
import { getPostsByUserID } from "../services/persistence/user";
import { Link } from "react-router-dom";

function UserPostsList({ user, userId }) {
  const [posts, setPosts] = useState(null);

  async function getPosts() {
    if (user) {
      // Check if user is not null
      const listPosts = await getPostsByUserID(userId);
      setPosts(listPosts.docs);
    }
  }

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className={"overflow-y-auto"} style={{ paddingBottom: "50px" }}>
      {posts ? (
        posts.map((p) => (
          <div className={"overflow-x-auto"}>
            <Link
              data-te-ripple-init
              data-te-ripple-centered="true"
              to={"/post/" + p.id}
              params={{ post: p.id }}
            >
              <UserPost key={p.id} post={p} />
            </Link>
          </div>
        ))
      ) : (
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
      )}
    </div>
  );
}

export default UserPostsList;
