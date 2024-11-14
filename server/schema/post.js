// follow.js

const redis = require("../config/redis");
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
    author:User
  }

   type Query{
    getAllPost:[Post]
    getPostById(id:ID!):Post
   }

  type Mutation {
    addPost(content: String!
    tags: [String]
    imgUrl: String): Post
    addComment(content:String!,postId:ID!):Comment
    like(postId:ID!):Like
  }
`;

const resolversPost = {
  Query: {
    getAllPost: async (_, __, context) => {
      // context.authentication();

      const redistPost =await redis.get("posts");
    //   if (redistPost) {
    //     // console.log("REDISSSSSSSS");
        
    //     return JSON.parse(redistPost);
    // }
    
    const posts = await Post.allPost();
    // posts.forEach((post) => {
    //   console.log(post); 
    // });
    
    await redis.set("posts", JSON.stringify(posts));
    
    // console.log(posts.author);
    return posts;
    },
    
    getPostById: async (_, args, context) => {
      context.authentication();
      const { id } = args;

      const post = await Post.findById({ id });
      return post;
    },
  },
  Mutation: {
    addPost: async (_, args, context) => {
      await redis.del("posts");
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

    addComment: async (_, args, context) => {
      //   console.log(context.authentication());

      const { username } = context.authentication();
      const { content, postId } = args;
      if (!content) {
        throw new Error("Content is required");
      }
      if (!postId) {
        throw new Error("Post Id is required");
      }

      const createdAt = new Date();
      const updatedAt = new Date();

      await Post.addComment({
        postId,
        content,
        username,
        createdAt,
        updatedAt,
      });
      return { content: content, username: username, createdAt, updatedAt };
    },

    like: async (_, args, context) => {
      //   console.log(context.authentication());

      const { username } = context.authentication();
      const { postId } = args;
      //   console.log(postId);

      if (!postId) {
        throw new Error("Post Id is required");
      }
      const createdAt = new Date();
      const updatedAt = new Date();

      await Post.addLike({
        postId,
        username,
        createdAt,
        updatedAt,
      });

      return { username: username, createdAt, updatedAt };
    },
  },
};

module.exports = { typeDefsPost, resolversPost };
