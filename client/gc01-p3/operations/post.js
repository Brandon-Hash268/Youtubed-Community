import { gql } from "@apollo/client";

export const GET_POST = gql`
  query GetAllPost {
    getAllPost {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      author {
        _id
        username
      }
    }
  }
`;

export const LIKE = gql`
  mutation Mutation($postId: ID!) {
    like(postId: $postId) {
      username
      createdAt
      updatedAt
    }
  }
`;

export const COMMENT = gql`
  mutation AddComment($content: String!, $postId: ID!) {
    addComment(content: $content, postId: $postId) {
      content
      username
      createdAt
      updatedAt
    }
  }
`;

export const GET_POST_DETAIL = gql`
  query GetPostById($getPostByIdId: ID!) {
    getPostById(id: $getPostByIdId) {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      likes {
        username
        createdAt
        updatedAt
      }
      author {
        _id
        name
        username
        email
      }
    }
  }
`;

export const GET_POST_BY_USER = gql`
  query GetPostByUserId($userId: ID!) {
    getPostByUserId(userId: $userId) {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      author {
        _id
        username
      }
    }
  }
`;

export const ADD_POST = gql`
  mutation AddPost($content: String!, $tags: [String], $imgUrl: String) {
    addPost(content: $content, tags: $tags, imgUrl: $imgUrl) {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;