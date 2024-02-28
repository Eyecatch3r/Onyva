import withAuthCheck from "./AuthComponent";
import UserPost from "./UserPost";
import { auth } from "../services/firebase";
import { useEffect, useState } from "react";
import { getPostsByUID } from "../services/persistence/user";
import { getPostUrl } from "../services/persistence/post";

function UserPostsList() {
  const [posts, setPosts] = useState(null);

  async function getPosts() {
    const listPosts = await getPostsByUID(auth.currentUser.uid);
    setPosts(listPosts.docs);
  }

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className={"overflow-y-auto"} style={{ paddingBottom: "50px" }}>
      {posts ? (
        posts.map((p) => (
          <div className={"overflow-x-auto"}>
            <UserPost key={p.id} post={p} />
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
