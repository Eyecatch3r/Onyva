import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path={"/login"} element={<Login />}></Route>
      <Route path={"/signup"} element={<SignUp />}></Route>
      <Route path={"/profile/:userId"} element={<Profile />}></Route>
      <Route path={"/resetpassword"} element={<ResetPassword />}></Route>
      <Route path={"/search"} element={<Search />}></Route>
    </Routes>
  );
}

export default App;
