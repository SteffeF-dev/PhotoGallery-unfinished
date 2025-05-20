const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("Failed to connect", error.message);
  });

const pictureSchema = new mongoose.Schema({
  fileName: String,
  contentType: String,
  imageBase64: String,
});

pictureSchema.set("toJSON", {
  transform: (doc, returnedObj) => {
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

module.exports = mongoose.model("Picture", pictureSchema);
