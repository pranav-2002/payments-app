const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://admin:<password>@trial.bc1fvq7.mongodb.net/payments_app",
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
);

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  firstName: {
    type: String,
    required: true,
    maxLength: 30,
  },
  lastName: {
    type: String,
    required: true,
    maxLength: 30,
  },
});

const AccountsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UsersModel",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

module.exports = { UserSchema, AccountsSchema };
