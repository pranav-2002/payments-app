const mongoose = require("mongoose");
const { UserSchema, AccountsSchema } = require("../index");

const UserModel = mongoose.model("UserModel", UserSchema);
const Accounts = mongoose.model("Accounts", AccountsSchema);

module.exports = { UserModel, Accounts };
