const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://admin:pranavvv@trial.bc1fvq7.mongodb.net/payments_app",
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
);
