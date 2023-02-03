var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var blog = require("../web322-app/blog-service");
var app = express();

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/about");
});

app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/views/about.html");
});

app.listen(HTTP_PORT, function () {
  console.log("Express http server listening on port " + HTTP_PORT);
});

app.get("/blog", (req, res) => {
  // Read the posts.json file
  blog.readFile("posts.json", "utf8", (err, data) => {
    if (err) {
      res.send(err);
    } else {
      // Parse the JSON data
      const posts = JSON.parse(data);
      // Filter the posts to only include those with published==true
      const publishedPosts = posts.filter((post) => post.published === true);
      // Send the filtered posts as a JSON string
      res.json(publishedPosts);
    }
  });
});

app.use("*", (req, res) => {
  res.status(404).send("Page Not Found");
});
