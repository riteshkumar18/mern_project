import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Todo from "./pages/Todo";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Signup Page */}
        <Route path="/" element={<Signup />} />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Todo Page */}
        <Route path="/todo" element={<Todo />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;