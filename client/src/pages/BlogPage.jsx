import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function BlogPage() {
  const [blogData, setBlogData] = useState({
    title: "",
    content: "",
  });
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBlogData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Retrieve the JWT from storage to send as part of the headers for authorization
      const token = localStorage.getItem("token");
      console.log(blogData);
      const response = await axios.post(
        "https://random-blogs.onrender.com/api/blogs/create",
        blogData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("Blog created successfully:", response.data);
        navigate("/home"); // Redirect to the home page after successful creation
      } else {
        console.error("Failed to create blog:", response.data);
      }
    } catch (error) {
      console.error(
        "Error creating blog:",
        error.response ? error.response.data : "No response"
      );
    }
  };

  return (
    <div>
      <h2>Create New Blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={blogData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={blogData.content}
            onChange={handleChange}
            rows="10"
            required
          />
        </div>
        <button type="submit">Create Blog</button>
      </form>
    </div>
  );
}

export default BlogPage;
