const { signToken } = require("../helpers/jwt");
const UserAuth = require("../model/userAuth");

const typeDefsUser = `#graphql
    type User{
        _id:ID
        name:String
        username:String
        email:String
    }

    type Token{
        access_token:String
        user:User
    }

    type Query{
        searchUser(username:String):[User]
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
  },

  Mutation: {
    login: async (_, args) => {
      const { email, password } = args;
      if (!email) {
        throw new Error("Email is required");
      }
      if (!password) {
        throw new Error("Password is required");
      }

      const user = await UserAuth.login({ email, password });
      if (!user) {
        throw new Error("Invalid Email or Password");
      }
      console.log(user);

      const access_token = signToken({ userId: user._id });
      console.log(access_token);

      return { access_token, user };
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
