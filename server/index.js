const { ApolloServer } = require( "@apollo/server")
const { startStandaloneServer } = require( "@apollo/server/standalone")
const {typeDefsUser,resolversUser} = require("./schema/auth")

async function startServer() {
  const server = new ApolloServer({
    typeDefs: typeDefsUser,
    resolvers: resolversUser,
    introspection: true,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
}

startServer();
