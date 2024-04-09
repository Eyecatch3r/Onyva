import React, { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import LoginSelection from "./LoginSelection";
import LoadingScreen from "./LoadingScreen";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import { getUserByUID } from "../services/persistence/user";
import { UserProvider } from "../contexts/UserContext";

const withAuthCheck = (WrappedComponent) => {
  return (props) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((authUser) => {
        setUser(authUser);
        setIsLoading(false);
      });
      return () => unsubscribe();
    }, []);

    if (isLoading) {
      return <LoadingScreen />;
    } else {
      return user ? (
        <UserProvider>
          <Navbar></Navbar> <WrappedComponent {...props} />{" "}
          <BottomNav></BottomNav>
        </UserProvider>
      ) : (
        <LoginSelection />
      );
    }
  };
};

export default withAuthCheck;
