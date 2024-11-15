import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import * as SecureStore from "expo-secure-store";

const httpLink = createHttpLink({
  uri: "https://9522-2001-448a-20a0-b6b-68ec-4274-6ad-713c.ngrok-free.app/",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = SecureStore.getItem("access_token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
