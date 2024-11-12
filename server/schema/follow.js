// follow.js
const { FollowUser } = require("../model/follow");

const typeDefsFollow = `#graphql
  type Follow {
    _id: ID!
    followingId: ID!
    followerId: ID!
    createdAt: String
    updatedAt: String
  }

  type Mutation {
    follow(followingId: ID!): Follow
  }
`;

const resolversFollow = {
  Mutation: {
    follow: async (_, args, context) => {
      const { userId } = context.authentication();
      const { followingId } = args;

      await FollowUser.follow({ userId, followingId });

      const follow = await FollowUser.findFollow({ userId, followingId });
      // console.log(follow);
      
      return follow;
    },
  },
};

module.exports = { typeDefsFollow, resolversFollow };
