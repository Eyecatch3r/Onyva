import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path={"/login"} element={<Login />}></Route>
      <Route path={"/signup"} element={<SignUp />}></Route>
      <Route path={"/profile"} element={<Profile />}></Route>
    </Routes>
  );
}

export default App;
