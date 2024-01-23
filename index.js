const express = require("express");
const rootRouter = require("./routes/index");
const userRouter = require("./routes/userRouter");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", rootRouter);
app.use("/user", userRouter);

app.listen("3000", () => {
  console.log("Server has started in port 3000");
});
