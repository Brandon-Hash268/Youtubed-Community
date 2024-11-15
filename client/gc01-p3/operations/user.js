import { gql } from "@apollo/client";

export const REGISTER = gql`
  mutation Register(
    $username: String!
    $email: String!
    $password: String!
    $name: String
  ) {
    register(
      username: $username
      email: $email
      password: $password
      name: $name
    ) {
      _id
      name
      username
      email
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      access_token
      username
      userId
    }
  }
`;

export const GET_USER = gql`
  query GetUserById($userId: ID!) {
    getUserById(userId: $userId) {
      _id
      name
      username
      email
      followers {
        _id
        name
        username
        email
      }
      following {
        _id
        name
        username
        email
      }
    }
  }
`;

export const FOLLOW = gql`
  mutation Mutation($followingId: ID!) {
    follow(followingId: $followingId) {
      _id
      followingId
      followerId
      createdAt
      updatedAt
    }
  }
`;

export const SEARCH_USER = gql`
  query SearchUser($username: String) {
    searchUser(username: $username) {
      _id
      name
      username
      email
      following {
        _id
        name
        username
        email
      }
      followers {
        _id
        name
        username
        email
      }
    }
  }
`;

