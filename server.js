const express = require("express");
const path = require("path");
const blogService = require("./blog-service.js");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: "dwp22m3wk",
  api_key: "278342816363226",
  api_secret: "AVa7ypERW_hZvctAR7",
  secure: true,
});

const upload = multer();
const app = express();

app.use(express.static("public"));

const HTTP_PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.redirect("/about");
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

app.get("/posts/add", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "addPost.html"));
});

app.post("/posts/add", upload.single("featureImage"), (req, res) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      return result;
    }

    upload(req).then((uploaded) => {
      processPost(uploaded.url);
    });
  } else {
    processPost("");
  }

  function processPost(imageUrl) {
    req.body.featureImage = imageUrl;
    const postData = req.body;
    blogService
      .addPost(postData)
      .then(() => {
        res.redirect("/posts");
      })
      .catch((err) => {
        console.error(err);
        res.redirect("/posts");
      });
  }
});

app.get("/blog", (req, res) => {
  blogService
    .getPublishedPosts()
    .then((data) => {
      res.send(data);
    })

    .catch((err) => {
      res.send(err);
    });
});

app.get("/posts", (req, res) => {
  const category = req.query.category;
  const minDateStr = req.query.minDate;
  let posts;

  if (category) {
    blogService
      .getPostsByCategory(category)
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        res.json(error);
      });
  } else if (minDateStr) {
    blogService
      .getPostsByMinDate(minDateStr)
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        res.json(error);
      });
  } else {
    posts = blogService
      .getAllPosts()
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        res.json(error);
      });
  }
});

app.get("/post/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  blogService
    .getPostById(id)
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json("Post not found");
    });
});

app.get("/categories", (req, res) => {
  blogService
    .getCategories()
    .then((data) => {
      res.send(data);
    })

    .catch((err) => {
      res.send(err);
    });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "notFoundPage.html"));
});

blogService
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("Express http server listening on: " + HTTP_PORT);
    });
  })
  .catch((error) => {
    console.error(`Failed to initialize blog service: ${error}`);
  });
