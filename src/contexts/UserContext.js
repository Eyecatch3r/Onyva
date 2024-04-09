import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../services/firebase";
import {
  addNotificationByID,
  deleteNotificationByIndex,
  getPfpUrlByID,
  getPfpUrlByUID,
  getUserByUID,
  increaseScore,
} from "../services/persistence/user";
import { createPost } from "../services/persistence/post";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Assuming you have an auth listener that sets the current user
    return auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userData = await getUserByUID(user.uid);
        if (userData) {
          const imageUrl = await getPfpUrlByID(userData.id);
          setUserDetails({ ...userData.data(), id: userData.id, imageUrl });
        }
      } else {
        setUserDetails(null);
      }
    });
  }, []);

  const createUserPost = async (file, score, selectedLandmark, location) => {
    // Assuming auth.currentUser is your user reference
    const userId = auth.currentUser;
    if (!userId) return;

    // Call your service function to create a post
    await createPost(userId, file, score, selectedLandmark, location);
  };

  const addUserNotification = async (notificationMessage) => {
    const userId = userDetails?.id;
    if (!userId) return;

    // Call your service function to add a notification
    await addNotificationByID(userId, notificationMessage);

    // Update local notifications state
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      notificationMessage,
    ]);
  };

  const increaseUserScore = async (incrementAmount) => {
    const userId = auth.currentUser?.uid;
    if (!userId || !userDetails) return;

    await increaseScore(userId, incrementAmount);

    // Assuming the score is updated in the database, fetch the latest user details
    const updatedUserData = await getUserByUID(userId);

    if (updatedUserData) {
      // Update userDetails state to reflect the new score
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        score: updatedUserData.data().score,
      }));

      console.log(`Score of user ${userId} increased by ${incrementAmount}.`);
    } else {
      console.log(`Failed to update score for user ${userId}`);
    }
  };

  const addNotification = (notification) => {
    setNotifications((prev) => [...prev, notification]);
  };

  const deleteNotification = (index) => {
    // Remove the notification at the specified index
    deleteNotificationByIndex(userDetails.id, index);
    setNotifications((prevNotifications) =>
      prevNotifications.filter((_, i) => i !== index),
    );
  };

  return (
    <UserContext.Provider
      value={{
        userDetails,
        notifications,
        addNotification,
        deleteNotification,
        createUserPost,
        addUserNotification,
        increaseUserScore,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
