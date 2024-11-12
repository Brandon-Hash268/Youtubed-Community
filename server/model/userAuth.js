const { database } = require("../config/mongodb");
const bcrypt = require("bcrypt");
const { signToken } = require("../helpers/jwt");

class UserAuth {
  static async findUser({ username, email }) {
    const byUserName = await database.collection("Users").findOne({ username });
    const byUserEmail = await database.collection("Users").findOne({ email });

    return { byUserName, byUserEmail };
  }

  static async register({ name, username, email, password }) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPass = bcrypt.hashSync(password, salt);

    const user = await database
      .collection("Users")
      .insertOne({ name, username, email, password: hashedPass });
    return user;
  }

  static async login({ email, password }) {
    const { byUserEmail: user } = await this.findUser({ email });
    if (!user) {
      throw new Error("Invalid Email or Password");
    }

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      throw new Error("Invalid Email or Password");
    }
    // console.log(user);
    
    const access_token = signToken({ userId: user._id,username:user.username });
    return access_token;
  }

  static async searchUser({ username }) {
    const regex = new RegExp(username, "i");
    const user = await database
      .collection("Users")
      .find({
        $or: [{ username: { $regex: regex } }, { name: { $regex: regex } }],
      })
      .toArray();

    return user;
  }

  static async findUserById({ id }) {
    const user = await database.collection("Users").findOne({ _id: id });

    return user;
  }
}

module.exports = UserAuth;
