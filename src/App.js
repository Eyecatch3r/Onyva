import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path={"/login"} element={<Login />}></Route>
      <Route path={"/Signup"} element={<SignUp />}></Route>
    </Routes>
  );
}

export default App;
