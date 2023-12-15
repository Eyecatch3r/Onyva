import "../App.css";
import { app, db, auth } from "../services/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

function Profile() {
  return (
    <div className={"App"}>
      <div className="card card-side bg-base-100 shadow-xl">
        <figure>
          <div className="avatar">
            <div className="w-24 mask mask-squircle">
              <img
                src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                alt={"Profile Picture"}
              />
            </div>
          </div>
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title">Profile Info</h2>
          <p>
            Username: <span>{}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
