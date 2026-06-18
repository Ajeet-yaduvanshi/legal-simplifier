import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Analyser from "./pages/Analyser";
import DocDetail from "./pages/DocDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analyser" element={<Analyser />} />
        <Route path="/document/:id" element={<DocDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
