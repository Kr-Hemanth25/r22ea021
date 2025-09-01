const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const urlRoutes = require("./routes/urlRoutes");

const app = express();
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
  res.send('URL Shortener Service is running');
});

mongoose.connect("mongodb://127.0.0.1:27017/urlshortener", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

app.use("/", urlRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
