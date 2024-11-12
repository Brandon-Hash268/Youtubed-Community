const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");

class Post {
  static async addPost({ content, tags, imgUrl, userId }) {
    const added = await database.collection("Posts").insertOne({
      content,
      tags,
      imgUrl,
      authorId: new ObjectId(String(userId)),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return added;
  }

  static async allPost() {
    const posts = await database
      .collection("Posts")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return posts;
  }

  static async findById({ id }) {
    const post = await database
      .collection("Posts")
      .findOne({ _id: new ObjectId(String(id)) });

    return post;
  }
}
module.exports = { Post };
