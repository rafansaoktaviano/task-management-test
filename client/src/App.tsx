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
