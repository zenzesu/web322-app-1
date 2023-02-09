/***********************************************************************
**********
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic
Policy. No part * of this assignment has been copied manually or electronically from any
other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Subin Gurung
  Student ID: 126819218
  Date: 09/02/2023

*
* Online (cyclic) Link: https://dark-lime-coral-hose.cyclic.app

************************************************************************
********/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var blog = require("./blog-service");
var app = express();
var path = require("path");

app.use(express.static("./public/"));

blog
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, function () {
      console.log("Express http server listening on port " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.error("Error initializing the blog service:", err);
  });

app.get("/", (req, res) => {
  res.redirect("/about");
});

app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/views/about.html");
});

app.get("/posts", (req, res) => {
  blog
    .getPosts()
    .then((data) => {
      res.json({ data });
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

app.get("/categories", (req, res) => {
  blog
    .getCategories()
    .then((data) => {
      res.json({ data });
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

app.get("/blog", (req, res) => {
  blog
    .getPublishedPosts()
    .then((data) => {
      res.json({ data });
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

app.use("*", (req, res) => {
  res.status(404).send("Page Not Found");
});
