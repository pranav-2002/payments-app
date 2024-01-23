const mongoose = require("mongoose");
const { UserSchema } = require("../schemas/schemas");

const UserModel = mongoose.model("UserModel", UserSchema);

module.exports = { UserModel };
