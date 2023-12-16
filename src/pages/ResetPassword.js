import "../App.css";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { resetPasswordEmail, auth } from "../services/firebase";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState(null);
  const sendEmail = async () => {
    try {
      await resetPasswordEmail(auth, email);
      setIsSent(true); // Set to true only when the email is successfully sent
    } catch (error) {
      const errorMessage = error.message;
      setError(errorMessage);
      console.error("Error sending reset email:", error);
    }
  };

  return (
    <div className={"App"}>
      <div className="flex items-center justify-center h-fit">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="text-2xl font-bold">Reset Password</h1>
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
              <div className={"flex justify-center"}>
                <button
                  type={"button"}
                  className="btn btn-primary mt-4"
                  onClick={sendEmail}
                >
                  Send Reset E-Mail
                </button>
              </div>
            </form>
            {isSent && (
              <div role="alert" className="alert">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-info shrink-0 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>Reset E-Mail Sent.</span>
              </div>
            )}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
