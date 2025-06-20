import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import TaskPage from "./pages/TaskPage/TaskPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<TaskPage />} />
      </Routes>
    </>
  );
}

export default App;
