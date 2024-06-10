import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import ResetPassword from "./pages/ResetPassword";
import Post from "./pages/Post";
import MapPage from "./pages/Map";
import { App, Page } from "konsta/react";

function MyApp() {
  return (
    <App>
      <Page>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path={"/login"} element={<Login />}></Route>
          <Route path={"/signup"} element={<SignUp />}></Route>
          <Route path={"/profile/:userId"} element={<Profile />}></Route>
          <Route path={"/resetpassword"} element={<ResetPassword />}></Route>
          <Route path={"/search"} element={<Search />}></Route>
          <Route path={"/post/:postId"} element={<Post />}></Route>
          <Route path="/map" element={<MapPage />}></Route>
        </Routes>
      </Page>
    </App>
  );
}

export default MyApp;
