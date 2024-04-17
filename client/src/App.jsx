/* eslint-disable no-unused-vars */
import "./App.css";
import React from "react";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import BlogPage from "./pages/BlogPage";
import ViewBlogPage from "./pages/ViewPage";

// import BlogDetailsPage from './pages/BlogDetailsPage';
// import CreateBlogPage from './pages/CreateBlogPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/home" element={<HomePage />} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/signup" element={<SignupPage />} />
        <Route exact path="/newBlog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<ViewBlogPage />} />
      </Routes>
    </Router>
  );
}

export default App;
