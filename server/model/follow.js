const { database } = require("../config/mongodb");
const {ObjectId} = require("mongodb")

class FollowUser {
  static async findFollow({ userId, followingId }) {
    const follow = await database.collection("Follows").findOne({
      followingId: new ObjectId(String(followingId)),
      followerId: new ObjectId(String(userId)),
    });
    // console.log(follow);
    
    return follow;
  }

  static async follow({ userId, followingId }) {
    const isfollowed = await this.findFollow({ userId, followingId });
    console.log(isfollowed);
    
    if (isfollowed) {
        throw new Error("You already followed this user")
    }

    const follow = await database.collection("Follows").insertOne({
      followingId: new ObjectId(String(followingId)),
      followerId: new ObjectId(String(userId)),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return follow;
  }
}

module.exports = {FollowUser}
