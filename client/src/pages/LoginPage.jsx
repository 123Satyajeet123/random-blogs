import { useState } from "react";
import axios from "axios";
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

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userDetails.email || !userDetails.password) {
      alert("All fields are required");
      return;
    }

    try {
      const response = await axios.post(
        "https://random-blogs.onrender.com/api/auth/login",
        userDetails
      );
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user.id);
        navigate("/");
      } else {
        throw new Error("Token not provided");
      }
    } catch (error) {
      console.error("Login error:");
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
