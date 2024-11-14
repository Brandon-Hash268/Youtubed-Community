import { useMutation, useQuery } from "@apollo/client";
import { Alert, FlatList, TouchableOpacity, View } from "react-native";
import { Text, Image, YStack, XStack } from "tamagui";
import { GET_POST, LIKE } from "../operations/post";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { ErrorScreen, loadingScreen } from "../components/loading";

export function HomeScreen() {
  const navigation = useNavigation();
  const { loading, error, data } = useQuery(GET_POST);
  const username = SecureStore.getItem("username");
  const [like, {}] = useMutation(LIKE);
  // console.log(username);

  // console.log(data.getAllPost[0]);
  // console.log(GET_POST);
  // console.log(loading,"loadinggggggggggggggggggggggggggggggggggggggggggggggggggg");

  if (loading) {
    return <ActivityIndicator size="large" color="white" />;
  }
  if (error) {
    Alert.alert("Error", error.message);
  }

  const handleLike = async (postId) => {
    try {
      await like({
        variables: { postId },
        refetchQueries: [{ query: GET_POST }],
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const isLikedByUser = (likes) => {
    if (!likes || !username) return false;
    return likes.some((like) => like.username === username);
  };

  const renderedItem = ({ item }) => (
    <YStack
      key={item._id}
      backgroundColor="black"
      overflow="hidden"
      borderBottomWidth={1}
      borderBottomColor="rgba(219, 219, 219, 0.3)"
    >
      {/* Video Thumbnail */}
      {/* Content and Tags */}
      <XStack alignContent="center">
        <View
          backgroundColor="white"
          alignItems="center"
          justifyContent="center"
          marginTop={11}
          marginLeft={20}
          borderRadius={50}
          height={50} // Height and width should be equal
          width={50}
        >
          <Text fontSize={16} fontWeight="bold" color="black">
            {item.author.username}
          </Text>
        </View>

        <YStack padding={12}>
          <Text color="white" fontSize={16} fontWeight="bold">
            {item.author.username}
          </Text>

          {/* <Text color="white">{item.tags}</Text> */}
          <Text color="white" fontSize={12} marginTop={8}>
            {/* Convert the tag string into an array and map over it */}
            {item.tags.map((tag, index) => (
              <Text
                key={index}
                color="white"
                fontSize={12}
                style={{ marginRight: 8 }}
              >
                #{tag} {/* Ensure no extra spaces */}
              </Text>
            ))}
          </Text>
          <Text color="white" fontSize={12} marginTop={8}>
            {item.content}
          </Text>
        </YStack>
      </XStack>
      <TouchableOpacity
        onPress={() => navigation.navigate("Detail", { id: item._id })}
      >
        <Image
          src={item.imgUrl}
          alt={item.content}
          width="100%"
          height="200"
          resizeMode="contain"
        />
      </TouchableOpacity>
      <XStack
        marginHorizontal={16}
        marginVertical={15}
        justifyContent="space-between"
      >
        <XStack gap={8} justifyContent="center" alignItems="center">
          <TouchableOpacity onPress={() => handleLike(item._id)}>
            <AntDesign
              name={isLikedByUser(item.likes) ? "like1" : "like2"}
              size={24}
              color="white"
            />
          </TouchableOpacity>

          <Text paddingTop={4} color="white">
            {item.likes ? item.likes.length : "0"}
          </Text>
        </XStack>
        <XStack gap={8} justifyContent="center" alignItems="center">
          <MaterialCommunityIcons
            name="comment-multiple-outline"
            size={24}
            color="white"
          />
          <Text paddingTop={4} color="white">
            {item.comments ? item.comments.length : "0"}
          </Text>
        </XStack>
      </XStack>
    </YStack>
  );

  return (
    <FlatList
      style={{ backgroundColor: "black" }}
      data={data.getAllPost} // Pass the data here
      renderItem={renderedItem} // Pass the renderItem function
      keyExtractor={(item) => item._id.toString()} // Ensure keyExtractor is used
    />
  );
}
