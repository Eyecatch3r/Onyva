import React, { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import LoginSelection from "./LoginSelection";
const withAuthCheck = (WrappedComponent) => {
  const WithAuthCheck = (props) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((authUser) => {
        setUser(authUser);
      });

      return () => unsubscribe();
    }, []);

    return user ? <WrappedComponent {...props} /> : <LoginSelection />;
  };

  return WithAuthCheck;
};

export default withAuthCheck;
