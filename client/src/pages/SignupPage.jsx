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

  const navigate = useNavigate(); // Hook for programmatically navigating

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

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        userDetails
      );
      console.log(response);
      if(response.status==200){
        navigate("/login")
      }
    } catch (error) {
      console.error(
        "Signup error:",
        error.response ? error.response.data : "No response"
      );
      if (error.response && error.response.status === 400) {
        // Redirect to login page if user already exists
        history.push("/login");
      }
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
