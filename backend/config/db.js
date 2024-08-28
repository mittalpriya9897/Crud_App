const mongoose = require("mongoose");

const connectToMongo = () => {
  return mongoose
    .connect("mongodb://localhost:27017/studentrecord")
    .then(() => {
      console.log("MongoDb connected Successfully");
    })
    .catch((err) => {
      console.error("error", err);
    });
};
module.exports = connectToMongo;
