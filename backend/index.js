const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const connectToMongo = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const logger = require("./logger");
const app = express();

app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

app.use((req, res, next) => {
  // Example logging an info level message
  logger.info("Request received", { meta: { req, res } });
  next();
});

app.use(cors());
app.use(express.json());

dotenv.config();

const PORT = process.env.PORT || 5000;

connectToMongo();

app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/subjects", subjectRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});

module.exports = logger;
