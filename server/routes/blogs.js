const express = require("express");
const Blog = require("../models/Blog");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Retrieve all blogs from the database
    const blogs = await Blog.find({});
    // Send the array of blogs back to the client
    res.status(200).json(blogs);
  } catch (error) {
    // Handle potential errors that might occur during fetching data from the database
    console.error("Error fetching blogs:", error);
    res
      .status(500)
      .json({ message: "Error fetching blogs", error: error.message });
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
  const authorId = req.user.id; // ID of the user, assuming _id is the field where user ID is stored

  const author = req.user.name;

  try {
    const blog = new Blog({ title, content, author, authorId });
    await blog.save();
    console.log("blog created");
    return res.status(200).json(blog);
  } catch (error) {
    console.log("Error in saving blog:", error); // Log the error to see what went wrong
    res
      .status(400)
      .json({ message: "Error creating blog", error: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.params;

  try {
    const blog = await Blog.findOneAndUpdate(
      { _id: id, authorId: req.user.id }, // Make sure it matches your schema fields
      { title, content },
      { new: true }
    );

    console.log(blog)
    if (!blog) {
      return res
        .status(404)
        .json({ message: "Blog not found or user not authorized" });
    }

    console.log("done")
    return res.status(200).json({"success":"true"});
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating blog", error: error.message });
  }
});


router.delete("/delete/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  if (blog.authorId.toString() !== req.user.id.toString()) {
    return res
      .status(403)
      .json({ message: "Unauthorized to delete this blog" });
  }

  try {
    await Blog.findOneAndDelete({ _id: req.params.id });
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete blog", error: error.message });
  }
});

module.exports = router;
