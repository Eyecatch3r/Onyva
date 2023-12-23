import "../App.css";
import withAuthCheck from "../components/AuthComponent";
import UserPostsList from "../components/UserPostsList";

function Home() {
  return (
    <div className={"App flex justify-center items-center"}>
      <div className={"flex w-96 flex-col justify-center items-center"}>
        <div className="divider divider-primary">User Posts</div>
        <UserPostsList></UserPostsList>
      </div>
    </div>
  );
}

export default withAuthCheck(Home);
