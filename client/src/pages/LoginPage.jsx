import { useState } from "react";
import axios from "axios"; // Ensure axios is installed for HTTP requests
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });
  const handleChange = (event) => {
    setUserDetails({
      ...userDetails,
      [event.target.name]: event.target.value,
    });
  };

  const navigate = useNavigate(); // Hook for programmatically navigating

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Simple validation
    if (!userDetails.email || !userDetails.password) {
      alert("All fields are required");
      return;
    }

    try {
      // Attempt to log in by sending a POST request to your authentication API
      const response = await axios.post(
        "https://random-blogs.onrender.com/api/auth/login",
        userDetails
      );
      if (response.data.token) {
        console.log("Login successful:", response.data.user.id);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user.id); // Store user ID during login

        navigate("/home");
      } else {
        throw new Error("Token not provided");
      }
    } catch (error) {
      console.error(
        "Login error:",
        error.response ? error.response.data : "No response"
      );
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={userDetails.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={userDetails.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Login</button>
        <Link to={"/signup"}>No account?? Signup</Link>
      </form>
    </div>
  );
}

export default LoginPage;
