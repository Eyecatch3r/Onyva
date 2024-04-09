import React, { useState, useRef, useCallback } from "react";
import { LoadScript } from "@react-google-maps/api";
import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";
import { useUser } from "../contexts/UserContext"; // Import useUser hook

const libraries = ["places"];

function CreatePostModal() {
  const { createUserPost, addUserNotification, increaseUserScore } = useUser(); // Destructure functions from context
  const fileInputRef = useRef(null);
  const [landmarks, setLandmarks] = useState([]);
  const [selectedLandmark, setSelectedLandmark] = useState("");
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const placesServiceRef = useRef(null);
  const [score, setScore] = useState(0);
  const modalRef = useRef(null);
  const [imageURL, setImageURL] = useState("");

  const fetchLandmarks = useCallback(() => {
    if (placesServiceRef.current && location.lat && location.lng) {
      const request = {
        location: new window.google.maps.LatLng(location.lat, location.lng),
        radius: "5000",
        type: ["tourist_attraction"],
      };

      placesServiceRef.current.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setLandmarks(results);
          console.log("Landmarks", results);
        }
      });
    }
  }, [location]);

  const handleModalShow = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
    if (location.lat && location.lng) {
      fetchLandmarks();
    }
  };

  // Triggered once the API script has loaded
  const handleApiLoaded = useCallback(() => {
    placesServiceRef.current = new window.google.maps.places.PlacesService(
      document.createElement("div"),
    );
    if (location.lat && location.lng) {
      fetchLandmarks();
    }
  }, [fetchLandmarks, location]);

  // Get the current location once when the component mounts
  useState(async () => {
    if (Capacitor.isPluginAvailable("Geolocation")) {
      try {
        const position = await Geolocation.getCurrentPosition();
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      } catch (error) {
        console.error("Error getting location", error);
      }
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleLandmarkChange = (event) => {
    setSelectedLandmark(event.target.value);
    setScore(Math.floor(Math.random() * 100));
  };
  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageURL(reader.result.toString());
      };
      reader.readAsDataURL(file);
    } else {
      setImageURL(""); // Clear the image URL if no file is selected
    }
  };

  const handlePostUpload = async () => {
    const file = fileInputRef.current.files[0];
    if (file && selectedLandmark) {
      await createUserPost(file, score, selectedLandmark, location);
      await addUserNotification(
        `You have created a post with a score of ${score} at ${selectedLandmark}!`,
      );
      await increaseUserScore(score);
      modalRef.current.close();
    }
  };

  return (
    <>
      <button
        className="btn btn-circle btn-primary flex items-center justify-center"
        onClick={handleModalShow}
      >
        <svg
          className="w-6 h-6 ml-[1px] mt-[1px]"
          viewBox="0 0 36 36"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Create post</title>
          <path d="M0 26.016q0 2.496 1.76 4.224t4.256 1.76h20q2.464 0 4.224-1.76t1.76-4.224v-20q0-2.496-1.76-4.256t-4.224-1.76h-20q-2.496 0-4.256 1.76t-1.76 4.256v20zM4 26.016v-20q0-0.832 0.576-1.408t1.44-0.608h20q0.8 0 1.408 0.608t0.576 1.408v20q0 0.832-0.576 1.408t-1.408 0.576h-20q-0.832 0-1.44-0.576t-0.576-1.408zM8 16q0 0.832 0.576 1.44t1.44 0.576h4v4q0 0.832 0.576 1.408t1.408 0.576 1.408-0.576 0.608-1.408v-4h4q0.8 0 1.408-0.576t0.576-1.44-0.576-1.408-1.408-0.576h-4v-4q0-0.832-0.608-1.408t-1.408-0.608-1.408 0.608-0.576 1.408v4h-4q-0.832 0-1.44 0.576t-0.576 1.408z"></path>
        </svg>
      </button>
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        libraries={libraries}
        onLoad={handleApiLoaded}
      >
        <dialog
          id="my_modal"
          className="modal modal-bottom sm:modal-middle"
          ref={modalRef}
        >
          <div className="modal-box">
            <h3 className="font-bold text-lg">Create a Post</h3>
            <div className="py-4">
              <select
                className="select select-bordered w-full"
                value={selectedLandmark}
                onChange={handleLandmarkChange}
              >
                <option disabled value="">
                  Select a landmark
                </option>
                {landmarks.map((landmark) => (
                  <option key={landmark.id} value={landmark.name}>
                    {landmark.name}
                  </option>
                ))}
              </select>
              {imageURL && (
                <img
                  src={imageURL}
                  alt="Selected"
                  className="max-w-full h-auto my-4"
                />
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className={"flex flex-col items-center justify-center"}>
                {score !== 0 ? (
                  <div className="stats shadow my-2">
                    <div className="stat flex-wrap">
                      <div className="stat-title">Score</div>
                      <div className="stat-value text-center">{score}</div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                <label
                  htmlFor="file-upload"
                  className="btn btn-primary mt-4"
                  onClick={handleFileInputClick}
                >
                  <svg
                    width="25px"
                    height="25px"
                    viewBox="-2.4 -2.4 28.80 28.80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    transform="rotate(0)"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0" />

                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M15 21H9C6.17157 21 4.75736 21 3.87868 20.1213C3 19.2426 3 17.8284 3 15M21 15C21 17.8284 21 19.2426 20.1213 20.1213C19.8215 20.4211 19.4594 20.6186 19 20.7487"
                        stroke="#1C274C"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 16V3M12 3L16 7.375M12 3L8 7.375"
                        stroke="#1C274C"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                </label>
              </div>
            </div>
            <div className="modal-action">
              <button
                disabled={!selectedLandmark || !imageURL}
                onClick={handlePostUpload}
                className="btn"
              >
                Post
              </button>
              <form method="dialog">
                <button className="btn btn-ghost">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      </LoadScript>
    </>
  );
}

export default CreatePostModal;
