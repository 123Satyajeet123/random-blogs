require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blogs");
const authenticate = require("./middlewares/userAuth");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
app.use(bodyParser.json());

app.use(cors());

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);

app.use("/api/blogs", authenticate() , blogRoutes);

app.get("/", (req, res) => res.send("Health! Ok"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
