import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
    name: "",
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    setUserDetails({
      ...userDetails,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userDetails.email || !userDetails.password || !userDetails.name) {
      alert("All fields are required");
      return;
    }

    if (userDetails.password.length < 7) {
      alert("Password must be at least 7 characters long");
      return;
    }

    try {
      const response = await axios.post(
        "https://random-blogs.onrender.com/api/auth/signup",
        userDetails
      );

      console.log("response", response);

      if (response.status == 200) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Signup error");
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={userDetails.name}
            onChange={handleChange}
          />
        </div>
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
        <button type="submit">Signup</button>
        <Link to={"/login"}> Already Have account? Login</Link>
      </form>
    </div>
  );
}

export default SignupPage;
