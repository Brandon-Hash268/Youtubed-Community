// follow.js

const { Post } = require("../model/post");

const typeDefsPost = `#graphql
    type Comment{
        content:String!
        username:String!
        createdAt:String
        updatedAt:String
    }

    type Like{
        username:String!
        createdAt:String
        updatedAt:String
    }

  type Post {
    _id: ID!
    content: String!
    tags: [String]
    imgUrl: String
    authorId: ID!
    comments:[Comment]
    likes:[Like]
    createdAt:String
    updatedAt:String
  }

  type Mutation {
    addPost(content: String!
    tags: [String]
    imgUrl: String): Post
  }
`;

const resolversPost = {
  Mutation: {
    addPost: async (_, args, context) => {
      const { content, tags, imgUrl } = args;
      if (!content) {
        throw new Error("Content is required");
      }
      if (!imgUrl) {
        throw new Error("Image Url is required");
      }
      const { userId } = context.authentication();

      await Post.addPost({ content, tags, imgUrl, userId });

      const post = await Post.findOne({ content, tags, imgUrl, userId });
      return post
    },
  },
};

module.exports = { typeDefsPost, resolversPost };
