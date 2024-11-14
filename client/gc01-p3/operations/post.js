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