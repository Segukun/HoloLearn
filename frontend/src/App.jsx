import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/layout.jsx";
import Home from "./pages/home.jsx";
import Courses from "./pages/courses.jsx";
import About from "./pages/about.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Profile from "./pages/profile.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="courses" element={<Courses />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}
