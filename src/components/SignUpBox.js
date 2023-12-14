import React, { useState } from "react";
import { app, db } from "../services/firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs } from "firebase/firestore";

function SignUpBox() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const handleSignUp = async () => {
    if (!validateUsername(username)) {
      setError("Username already in use.");
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!isChecked) {
      setError("Please Accept our Privacy Policy.");
      return;
    }

    const auth = getAuth(app);
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        const docRef = await addDoc(collection(db, "User"), {
          username: username,
          useruid: user.uid,
          score: 0,
        });
        console.log("User created:", user);
        navigate("/");
        // Additional actions after successful signup
      })
      .catch((error) => {
        const errorCode = error.code;
        let errorMessage = error.message;

        // Modify errorMessage as per your requirement
        const index = errorMessage.indexOf("("); // Find the index of the first '('
        if (index > 10) {
          // Omit the first 10 characters and the content inside parentheses
          errorMessage =
            errorMessage.substring(10, index) +
            errorMessage.substring(errorMessage.indexOf(")") + 1);
        }

        setError(errorMessage); // Set the modified error message for display
        console.error("Error creating user:", error);
      });
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validateUsername = async (username) => {
    let usernameTaken = false;

    const querySnapshot = await getDocs(collection(db, "Users"));
    querySnapshot.forEach((doc) => {
      doc.data().username === username
        ? (usernameTaken = true)
        : (usernameTaken = true);
    });

    return usernameTaken;
  };

  return (
    <div className="flex items-center justify-center h-fit">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body pb-2">
          <h1 className="text-2xl font-bold">Sign Up for OnYva</h1>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Username</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">E-Mail Address</span>
            </div>
            <input
              type="email"
              className="input input-bordered w-full max-w-xs"
              placeholder="E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Password</span>
            </div>
            <input
              type="password"
              className="input input-bordered w-full max-w-xs"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label className="label cursor-pointer">
            <span className="label-text">
              I have read and agreed to the{" "}
              <Link to={"/Privacy"}>Privacy Policy </Link>{" "}
            </span>
            <input
              required={true}
              type="checkbox"
              className="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
          </label>
        </div>
        <div className="card-actions justify-center mb-3">
          <button className="btn btn-primary" onClick={handleSignUp}>
            Sign Up
          </button>
        </div>
        {error && (
          <div role="alert" className="alert alert-error mb-3 mx-2 w-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}{" "}
        {/* Display error message */}
      </div>
    </div>
  );
}

export default SignUpBox;
