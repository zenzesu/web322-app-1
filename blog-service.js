const fs = require("fs");
const path = require("path");

let posts = [];
let categories = [];

const postsPath = path.join(__dirname, "data", "posts.json");
const categoriesPath = path.join(__dirname, "data", "categories.json");

const initialize = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("./data/posts.json", "utf8", (err, data) => {
      if (err) return reject("unable to read posts file");
      posts = JSON.parse(data);
    });
    fs.readFile("./data/categories.json", "utf8", (err, data) => {
      if (err) return reject("unable to read categories file");
      categories = JSON.parse(data);
      resolve();
    });
  });
};

const getPosts = () => {
  return new Promise((resolve, reject) => {
    if (posts.length === 0) return reject("no posts found");
    resolve(posts);
  });
};

const getPublishedPosts = () => {
  return new Promise((resolve, reject) => {
    const publishedPosts = posts.filter((post) => post.published);
    if (publishedPosts.length === 0) return reject("no published posts found");
    resolve(publishedPosts);
  });
};

const getCategories = () => {
  return new Promise((resolve, reject) => {
    if (categories.length === 0) return reject("no categories found");
    resolve(categories);
  });
};

module.exports = { initialize, getPosts, getPublishedPosts, getCategories };
