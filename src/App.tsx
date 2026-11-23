import { BrowserRouter, Routes, Route } from "react-router";
import GoalsActionPage from "./pages/GoalsActionPage";
import NavBar from "./components/NavBar";
import GoalsPage from "./pages/GoalsPage";


export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<GoalsActionPage />} />
        <Route path="/goals" element={<GoalsPage />} />
      </Routes>
    </>
  );
}