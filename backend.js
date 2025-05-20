require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const multer = require("multer");
const Picture = require("./mongo");
const app = express();
app.use(cors());
app.use(morgan("tiny"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.get("/api/pictures", (request, response) => {
  Picture.find().then((pics) => {
    response.json(pics);
  });
});

app.post("/api/pictures", upload.array("files", 10), (req, res, next) => {
  const files = req.files;

  const imgArray = files.map((file) => {
    const img = fs.readFileSync(file.path);
    return (encImg = img.toString("base64"));
  });

  imgArray.map((src, index) => {
    const imgObj = new Picture({
      fileName: files[index].originalname,
      contentType: files[index].mimetype,
      imageBase64: src,
    });

    return imgObj
      .save()
      .then((addedImg) => {
        res.json(addedImg);
      })
      .catch((err) => {
        console.log("Something went wrong", err.message);
      });
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
