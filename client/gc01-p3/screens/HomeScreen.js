import { useQuery } from "@apollo/client";
import {
  ActivityIndicator,
  Alert,
  FlatList,
} from "react-native";
import { GET_POST, LIKE } from "../operations/post";
import { RenderedItem } from "../components/PostCom";

export function HomeScreen() {
  const { loading, error, data } = useQuery(GET_POST);
  
  if (loading) {
    return <ActivityIndicator size="large" color="white" />;
  }
  if (error) {
    Alert.alert("Error", error.message);
  }

  return (
    <FlatList
      style={{ backgroundColor: "black" }}
      data={data.getAllPost} // Pass the data here
      renderItem={({ item }) => <RenderedItem item={item} />} // Pass the renderItem function
      keyExtractor={(item) => item._id.toString()} // Ensure keyExtractor is used
    />
  );
}
