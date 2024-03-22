import React, { useEffect, useState } from "react";
import "../App.css";
import withAuthCheck from "../components/AuthComponent";
import { getFriendsPosts } from "../services/persistence/post";
import InfiniteScroll from "react-infinite-scroll-component";
import { auth } from "../services/firebase";
import UserFeed from "../components/UserFeed";

function Home() {
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchMoreData();
  }, []);

  const fetchMoreData = async () => {
    const newPosts = await getFriendsPosts(auth.currentUser.uid);
    if (newPosts.length === 0) {
      setHasMore(false);
    } else {
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    }
  };

  return (
    <div className={"App flex justify-center items-center"}>
      <div className={"flex w-96 flex-col justify-center items-center"}>
        <div className="divider divider-primary">Feed</div>
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <div className="skeleton flex flex-col gap-4 w-52 mb-4">
              <div className="flex gap-4 items-center">
                <div className="skeleton w-16 h-16 rounded-full shrink-0"></div>
                <div className="flex flex-col gap-4">
                  <div className="skeleton h-4 w-20"></div>
                  <div className="skeleton h-4 w-28"></div>
                </div>
              </div>
            </div>
          }
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Thats all for now!</b>
            </p>
          }
        >
          <UserFeed posts={posts} />
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default withAuthCheck(Home);
