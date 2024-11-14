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