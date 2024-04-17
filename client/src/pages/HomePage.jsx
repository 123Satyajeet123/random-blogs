import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
function HomePage() {
  const navigate = useNavigate();
  const [isValidToken, setIsValidToken] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const userId = localStorage.getItem("userId");

  const verify = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    const verifyResponse = await axios.post(
      "https://random-blogs.onrender.com/api/auth/verify",
      { token }
    );
    if (verifyResponse.status === 200) {
      setIsValidToken(true);
      return token;
    }
  };

  const fetchData = async () => {
    try {
      let token = await verify();

      const blogsResponse = await axios.get(
        "https://random-blogs.onrender.com/api/blogs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(blogsResponse.data)
      if (blogsResponse.data && blogsResponse.data.length > 0) {
        setBlogs(blogsResponse.data);
      } else {
        console.error("No blogs found.");
        setBlogs([]);
      }
    } catch (error) {
      console.error("Error during data fetching:", error);
      navigate("/login");
    }
  };

  const handleDeleteBlog = async (id) => {
    try {
      let token = await verify();
      console.log("handle delete", token);
      const response = await axios.delete(
        `https://random-blogs.onrender.com/api/blogs/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setBlogs((currentBlogs) =>
          currentBlogs.filter((blog) => blog._id !== id)
        );
      } else {
        console.error("Failed to delete the blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!isValidToken) {
    return <div>Verifying...</div>;
  }

  const handleNewBlog = () => {
    navigate("/newBlog");
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {blogs.map((blog) => (
          <div
            key={blog._id}
            style={{
              width: "300px",
              border: "1px solid black",
              padding: "20px",
              boxSizing: "border-box",
            }}
          >
            <h3>{blog.title}</h3>
            <p>{blog.content.substring(0, 100)}...</p>
            <p>{blog.author}</p>
            <p>{blog.updatedAt.slice(10)}</p>

            <Link to={`/blog/${blog._id}`}>
              <button>View</button>
            </Link>
            {blog.authorId === userId && (
              <button
                style={{ backgroundColor: "#ff3232" }}
                onClick={() => {
                  if (
                    window.confirm("Are you sure you want to delete this blog?")
                  ) {
                    handleDeleteBlog(blog._id);
                  }
                }}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
      <button onClick={handleNewBlog} style={{ marginTop: "20px" }}>
        Add New Blog
      </button>
    </div>
  );
}

export default HomePage;
