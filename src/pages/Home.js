import React, { useEffect, useState } from "react";
import withAuthCheck from "../components/AuthComponent";
import { getFriendsPosts } from "../services/persistence/post";
import InfiniteScroll from "react-infinite-scroll-component";
import { auth } from "../services/firebase";
import UserFeed from "../components/UserFeed";
import CreatePostModal from "../components/CreatePostModal";

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
    <div className="App flex justify-center items-center">
      <div className="flex w-96 flex-col justify-center items-center">
        <div className="divider divider-primary">Feed</div>
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p className="text-center">
              <b>That's all for now!</b>
            </p>
          }
        >
          <UserFeed posts={posts} />
        </InfiniteScroll>
        <div className="fixed bottom-16 right-8 z-50">
          <CreatePostModal />
        </div>
      </div>
    </div>
  );
}

export default withAuthCheck(Home);
