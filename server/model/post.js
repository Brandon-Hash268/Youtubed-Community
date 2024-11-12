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

  static async addComment({ content, username, postId, createdAt, updatedAt }) {
    const newComment = {
      content: content,
      username: username,
      createdAt,
      updatedAt,
    };
    const comment = await database
      .collection("Posts")
      .updateOne(
        { _id: new ObjectId(String(postId)) },
        { $push: { comments: newComment } }
      );
    // console.log(comment, "<<<<<<<<<<");

    return comment;
  }
}
module.exports = { Post };
