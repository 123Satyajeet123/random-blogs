const express = require("express");
const Blog = require("../models/Blog");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find({});

    return res.status(200).json(blogs);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching blogs" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      // If no blog is found, return a 404 status
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    // Handle possible errors, such as invalid ID formats
    res
      .status(500)
      .json({ message: "Error retrieving blog", error: error.message });
  }
});

router.post("/create", async (req, res) => {
  const { title, content } = req.body;
  console.log(req.user);
  const authorId = req.user.id;

  const author = req.user.name;

  try {
    const blog = new Blog({ title, content, author, authorId });
    await blog.save();
    console.log("blog created");
    return res.status(200).json(blog);
  } catch (error) {
    return res.status(400).json({ message: "Error creating blog" });
  }
});

router.put("/update/:id", async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.params;

  try {
    const blog = await Blog.findOneAndUpdate(
      { _id: id, authorId: req.user.id },
      { title, content },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    console.log("done");
    return res.status(200).json({ success: "true" });
  } catch (error) {
    return res.status(500).json({ message: "Error updating blog" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  if (blog.authorId.toString() !== req.user.id.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    await Blog.findOneAndDelete({ _id: req.params.id });
    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete blog" });
  }
});

module.exports = router;
