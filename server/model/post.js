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
    const post = await database.collection("Posts").aggregate([
      {
        $match: { _id: new ObjectId(String(id)) },
      },
      {
        $lookup: {
          from: "Users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind:"$author"
      }
    ]).toArray();

    if (post.length === 0) {
      throw new Error("Post not found");
    }

    return post[0];
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

  static async addLike({ username, postId, createdAt, updatedAt }) {
    const newLikes = {
      username: username,
      createdAt,
      updatedAt,
    };
    const isliked = await database.collection("Posts").findOne({
      _id: new ObjectId(String(postId)),
      likes: { $elemMatch: { username: username } },
    });

    if (isliked) {
      await database
        .collection("Posts")
        .updateOne(
          { _id: new ObjectId(String(postId)) },
          { $pull: { likes:{username: username} } }
        );
        console.log("deleted");
        
        return
      }
      await database
      .collection("Posts")
      .updateOne(
        { _id: new ObjectId(String(postId)) },
        { $push: { likes: newLikes } }
      );
      // console.log(comment, "<<<<<<<<<<");
      console.log(newLikes);
      
      console.log("add");
    return;
  }
}
module.exports = { Post };
