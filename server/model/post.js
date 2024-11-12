const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");

class Post {
  static async findOne({ content, tags, imgUrl, userId }) {
    const post = await database.collection("Posts").findOne({
      content,
      tags,
      imgUrl,
      authorId: new ObjectId(String(userId)),
    });

    return post;
  }
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
}
module.exports={Post}
