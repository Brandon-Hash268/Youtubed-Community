import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
//   uri: "http://192.168.1.6:4000",
  uri: "https://b07f-2001-448a-20a0-b6b-88ae-9c21-cdca-3b7d.ngrok-free.app",
  cache: new InMemoryCache(),
});
