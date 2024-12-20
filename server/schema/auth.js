const { signToken } = require("../helpers/jwt");
const UserAuth = require("../model/userAuth");

const typeDefsUser = `#graphql
    type FollowUser{
      _id:ID!
      name:String
      username:String
      email:String
    }

    type User{
        _id:ID!
        name:String
        username:String!
        email:String!
        followers:[FollowUser]
        following:[FollowUser]
    }

    type Token{
        access_token:String!
        username:String
        userId:ID!
    }

    type Query{
        searchUser(username:String):[User]
        getUserById(userId: ID!): User
    }

    type Mutation{
        login(email:String!,password:String!):Token
        register(name:String,username:String!,email:String!,password:String!):User
    }
`;

const resolversUser = {
  Query: {
    searchUser: async (_, args) => {
      const { username } = args;

      const users = await UserAuth.searchUser({ username });

      return users;
    },
    getUserById: async (_, args) => {
      const { userId } = args;
      // console.log(userId);

      const user = await UserAuth.findUserById({ id: userId });
      console.log(user);

      return user;
    },
  },

  Mutation: {
    login: async (_, args) => {
      const { email, password } = args;
      if (!email) {
        throw new Error("Email is required");
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
      }
      if (!password) {
        throw new Error("Password is required");
      }

      const access_token = await UserAuth.login({ email, password });
      const { byUserEmail } = await UserAuth.findUser({ email });
      // console.log(byUserEmail);

      return { access_token: access_token, username: byUserEmail.username,userId:byUserEmail._id };
    },

    register: async (_, args) => {
      const { name, username, email, password } = args;
      console.log(name);

      if (!username) {
        throw new Error("Username is required");
      }
      if (!email) {
        throw new Error("Email is required");
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
      }
      if (!password) {
        throw new Error("Password is required");
      }
      if (password.length < 5) {
        throw new Error("Password Minimal length is 5");
      }

      const { byUserName, byUserEmail } = await UserAuth.findUser({
        username,
        email,
      });
      if (byUserName) {
        throw new Error("User with that Username already exist");
      }
      if (byUserEmail) {
        throw new Error("User with that email already exist");
      }

      const { insertedId } = await UserAuth.register({
        name,
        username,
        email,
        password,
      });
      const user = UserAuth.findUserById({ id: insertedId });

      return user;
    },
  },
};

module.exports = { typeDefsUser, resolversUser };
