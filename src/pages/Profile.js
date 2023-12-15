import "../App.css";
import { app, db, auth } from "../services/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { getUser, getUserByUID } from "../services/persistence/user";
import { useEffect, useState } from "react";
import withAuthCheck from "../components/AuthComponent";

function Profile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const user = await getUserByUID(auth.currentUser.uid);
        user ? setUsername(user.username) : setUsername("");
        setEmail(auth.currentUser.email);
      } catch (error) {
        // Handle errors if needed
        console.error("Error fetching username:", error);
      }
    }

    fetchData();
  }, []); // Empty dependency array to run this effect only once (on mount)

  return (
    <div className={"App"}>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h1 className="card-title">Profile Info</h1>
          <div className="avatar">
            <div className="w-24 rounded-full">
              <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
          </div>
          <table className={"table"}>
            <tbody>
              <tr>
                <td>
                  <p>
                    <div className="badge badge-primary badge-lg mr-2">
                      Username
                    </div>
                    {username}
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    <div className="badge badge-primary badge-lg mr-2">
                      E-Mail Address
                    </div>
                    <span>{email}</span>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default withAuthCheck(Profile);
