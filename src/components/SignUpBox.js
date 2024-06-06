import React, { useState, useEffect } from "react";
import { auth, createUser, sendVerificationEmail } from "../services/firebase";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/persistence/user";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

function SignUpBox() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const navigate = useNavigate();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const handleInputChange = (e) => {
    const input = e.target.value;
    setAddress(input);

    if (isLoaded && input.length > 3) {
      const autocompleteService =
        new window.google.maps.places.AutocompleteService();
      autocompleteService.getPlacePredictions(
        { input },
        (predictions, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setSuggestions(predictions);
            setSuggestionsVisible(true); // Show suggestions only if there are predictions
          } else {
            setSuggestions([]); // Clear suggestions if none are found
            setSuggestionsVisible(false); // Hide the suggestions if there are no results
          }
        },
      );
    } else {
      setSuggestions([]); // Clear suggestions for short inputs
      setSuggestionsVisible(false); // Hide suggestions if the input length is less than or equal to 3
    }
  };

  const handlePlaceSelect = (place) => {
    setAddress(place.description);
    setSuggestions([]);
  };

  function trimErrorMessage(errorMessage) {
    const index = errorMessage.indexOf("(");
    if (index > 10) {
      errorMessage =
        errorMessage.substring(10, index) +
        errorMessage.substring(errorMessage.indexOf(")") + 1);
    }
    return errorMessage;
  }

  const handleSignUp = async () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!isChecked) {
      setError("Please Accept our Privacy Policy.");
      return;
    }

    createUser(email, password, address)
      .then(async (userCredential) => {
        await registerUser(userCredential, username, address);
        await sendVerificationEmail(userCredential.user);
        navigate("/");
      })
      .catch((error) => {
        let errorMessage = trimErrorMessage(error.message);
        setError(errorMessage);
        console.error("Error creating user:", error);
      });
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  return (
    <div className="flex items-center justify-center h-fit my-52">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body pb-2">
          <h1 className="text-2xl font-bold">Sign Up for OnYva</h1>
          <form>
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
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Address</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                placeholder="Address"
                value={address}
                id="address-input"
                onFocus={() => setSuggestionsVisible(true)} // Show suggestions on focus
                onBlur={() =>
                  setTimeout(() => setSuggestionsVisible(false), 200)
                }
                onChange={handleInputChange}
              />
              {suggestions.length > 0 && (
                <ul
                  className={`bg-base-200 border border-gray-300 w-full mt-1 max-h-56 overflow-y-auto transform transition-all duration-300 ${
                    suggestionsVisible
                      ? "opacity-100 scale-100"
                      : "h-0 opacity-0 scale-95"
                  }`}
                >
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion.place_id}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onMouseDown={() => handlePlaceSelect(suggestion)}
                    >
                      {suggestion.description}
                    </li>
                  ))}
                </ul>
              )}
            </label>
            <label className="label cursor-pointer">
              <span className="label-text">
                I have read and agreed to the{" "}
                <Link to={"/Privacy"}>Privacy Policy</Link>
              </span>
              <input
                required={true}
                type="checkbox"
                className="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
            </label>
            <div className={"flex flex-row"}>
              <button
                type={"button"}
                className="btn btn-ghost w-1/2"
                onClick={handleSignUp}
              >
                Sign Up
              </button>
              <Link to={"/"} className={"ml-8 btn-outline btn btn-primary"}>
                Cancel
              </Link>
            </div>
          </form>
        </div>
        <div className="card-actions justify-center mb-3"></div>
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
        )}
      </div>
    </div>
  );
}

export default SignUpBox;
