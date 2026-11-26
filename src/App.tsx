import { Routes, Route, Outlet } from "react-router";
import GoalsActionPage from "./pages/GoalsActionPage";
import GoalsPage from "./pages/GoalsPage";
import NavBar from "./components/NavBar";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

// Show the navbar on the task and goal pages.
function GoalsLayout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />

      <Route element={<GoalsLayout />}>
        <Route path="/" element={<GoalsActionPage />} />
        <Route path="/goals" element={<GoalsPage />} />
      </Route>
    </Routes>
  );
}