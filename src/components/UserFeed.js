import withAuthCheck from "./AuthComponent";
import UserPost from "./UserPost";
import { auth } from "../services/firebase";
import { useEffect, useState } from "react";
import { getPostsByUID, getPostsByUserID } from "../services/persistence/user";
import { getPostUrl } from "../services/persistence/post";
import { Link } from "react-router-dom";

function UserFeed({ posts }) {
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

export default UserFeed;
