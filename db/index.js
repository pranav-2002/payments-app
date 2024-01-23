const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://admin:pranav.2002@trial.bc1fvq7.mongodb.net/payments_app",
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
);
