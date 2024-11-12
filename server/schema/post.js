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

   type Query{
    getAllPost:[Post]
    getPostById(id:ID!):Post
   }

  type Mutation {
    addPost(content: String!
    tags: [String]
    imgUrl: String): Post
  }
`;

const resolversPost = {
  Query: {
    getAllPost: async (_, __, context) => {
      context.authentication();

      const posts = await Post.allPost();
      return posts;
    },
    getPostById: async (_,args, context) => {
      context.authentication();
      const {id} = args

      const post = await Post.findById({id});
      return post;
    },
  },
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

      const { insertedId } = await Post.addPost({
        content,
        tags,
        imgUrl,
        userId,
      });

      const post = await Post.findById({ id: insertedId });
      return post;
    },
  },
};

module.exports = { typeDefsPost, resolversPost };
