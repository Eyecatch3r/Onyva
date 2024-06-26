import React, { useState } from "react";
import { signIn } from "../services/firebase";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "konsta/react";

function LoginBox() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    signIn(email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        navigate("/");
        console.log("User signed in:", user);
        // Additional actions after successful login
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError("Wrong E-mail/Password"); // Set the error message for display
        console.error("Error signing in:", error);
      });
  };

  // Email validation function using regex
  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  return (
    <div className="flex items-center justify-center h-fit my-52">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-2xl font-bold">Log in to OnYva</h1>
          <form>
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

            <div>
              <label className="label cursor-pointer">
                <span className="label-text">
                  <Link to={"/resetpassword"}>Reset Password</Link>{" "}
                </span>{" "}
              </label>
            </div>
            <div className="card-actions flex flex-row justify-center mb-3">
              <button
                type={"button"}
                className="btn btn-ghost w-1/2"
                onClick={handleSignIn}
              >
                Login
              </button>
              <Link to={"/"} className={"ml-8 btn-outline btn btn-primary"}>
                Cancel
              </Link>
            </div>
          </form>
          {error && (
            <div
              role="alert"
              className="animate-fade animate-ease-out alert alert-error flex flex-row mb-3 mx-2 w-auto"
            >
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
    </div>
  );
}

export default LoginBox;
