const { database } = require("../config/mongodb");

class UserAuth {
  static async findUser({ username, email }) {
    const byUserName = await database.collection("Users").findOne({ username });
    const byUserEmail = await database.collection("Users").findOne({ email });

    return { byUserName, byUserEmail };
  }

  static async register({ name, username, email, password }) {
    const user = await database
      .collection("Users")
      .insertOne({ name, username, email, password });
    return user;
  }

  static async login({ email, password }) {
    const { byUserEmail: user } = await this.findUser({ email });
    if (user.password !== password) {
      return null;
    }

    return user;
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
    const user = await database.collection("Users").findOne({ _id:id });

    return user
  }
}

module.exports = UserAuth;
