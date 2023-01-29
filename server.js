var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
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
