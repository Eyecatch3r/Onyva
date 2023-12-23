import React, { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import LoginSelection from "./LoginSelection";
import LoadingScreen from "./LoadingScreen";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";

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
        <div>
          <Navbar></Navbar> <WrappedComponent {...props} />{" "}
          <BottomNav></BottomNav>
        </div>
      ) : (
        <LoginSelection />
      );
    }
  };
};

export default withAuthCheck;
