const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { typeDefsUser, resolversUser } = require("./schema/auth");
const { typeDefsFollow, resolversFollow } = require("./schema/follow");
const { typeDefsPost, resolversPost } = require("./schema/post");
const { verifyToken } = require("./helpers/jwt");
const { GraphQLError } = require("graphql");

async function startServer() {
  const server = new ApolloServer({
    typeDefs: [typeDefsUser, typeDefsFollow, typeDefsPost],
    resolvers: [resolversUser, resolversFollow, resolversPost],
    introspection: true,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: ({ req }) => {
      return {
        authentication: () => {
          const token = req.headers.authorization.split(" ")[1];
          const message = "Invalid Token";
          if (!token) {
            throw new GraphQLError(message, {
              extensions: {
                code: "UNAUTHENTICATED",
                http: { status: 401 },
              },
            });
          }

          const user = verifyToken(token);
          console.log(user);
          
          return user;
        },
      };
    },
  });

  console.log(`🚀  Server ready at: ${url}`);
}

startServer();
