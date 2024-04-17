import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ViewBlogPage() {
  const [blog, setBlog] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchBlog(token);
  }, [editing]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(
        `https://random-blogs.onrender.com/api/blogs/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setBlog(response.data);
        setFormData({
          title: response.data.title,
          content: response.data.content,
        });
      }
    } catch (error) {
      console.error("Failed to fetch blog:", error);
    }
  };

  const handleEdit = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const response = await axios.put(
        `https://random-blogs.onrender.com/api/blogs/update/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setBlog(response.data);
        setEditing(false);
      }
    } catch (error) {
      console.error("Failed to update blog:", error);
    }
  };

  return (
    <div>
      {blog ? (
        <>
          {editing ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
              <button onClick={handleEdit}>Save Changes</button>
            </div>
          ) : (
            <>
              <h1>{blog.title}</h1>
              <p>{blog.content}</p>
              {blog.authorId === userId && (
                <button onClick={() => setEditing(true)}>Edit</button>
              )}
            </>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default ViewBlogPage;
