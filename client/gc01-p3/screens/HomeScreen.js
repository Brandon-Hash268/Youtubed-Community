import { useQuery } from "@apollo/client";
import { FlatList, View } from "react-native";
import { Text, Image, YStack, XStack } from "tamagui";
import { GET_POST } from "../operations/post";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ActivityIndicator } from "react-native-paper";

export function HomeScreen() {
  const { loading, error, data } = useQuery(GET_POST);
  // console.log(data.getAllPost[0]);
  // console.log(GET_POST);
  // console.log(loading,"loadinggggggggggggggggggggggggggggggggggggggggggggggggggg");
  if (loading) {
    return <ActivityIndicator size="large" color="white" />;
  }
  if (error) {
    return <Text>{error.message}</Text>
  }

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
            {item.content}
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
        </YStack>
      </XStack>
      <Image src={item.imgUrl} alt={item.content} width="100%" height={200} />
      <XStack
        marginHorizontal={16}
        marginVertical={15}
        justifyContent="space-between"
      >
        <XStack gap={8} justifyContent="center" alignItems="center">
          <AntDesign name="like2" size={24} color="white" />

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
      data={data.getAllPost} // Pass the data here
      renderItem={renderedItem} // Pass the renderItem function
      keyExtractor={(item) => item._id.toString()} // Ensure keyExtractor is used
    />
  );
}
