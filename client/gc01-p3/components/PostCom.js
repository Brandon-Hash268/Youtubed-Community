import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text, Image, YStack, XStack } from "tamagui";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { GET_POST, LIKE } from "../operations/post";
import { useMutation } from "@apollo/client";

export function RenderedItem({ item }) {
  const navigation = useNavigation();
  const username = SecureStore.getItem("username");
  const [like, {}] = useMutation(LIKE);

  const isLikedByUser = (likes) => {
    if (!likes || !username) return false;
    return likes.some((like) => like.username === username);
  };

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
  //   item.tags.map(e=>{
  //       console.log(e);

  //   })

  return (
    <YStack
      key={item._id}
      backgroundColor="black"
      overflow="hidden"
      borderBottomWidth={1}
      borderBottomColor="rgba(219, 219, 219, 0.3)"
    >
      {/* User Info */}
      <XStack alignContent="center">
        <View
          backgroundColor="white"
          alignItems="center"
          justifyContent="center"
          marginTop={11}
          marginLeft={20}
          borderRadius={50}
          height={50}
          width={50}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Profile", { id: item.author._id })
            }
          >
            <Text fontSize={16} fontWeight="bold" color="black">
              {item.author.username}
            </Text>
          </TouchableOpacity>
        </View>

        <YStack padding={12}>
          <Text color="white" fontSize={16} fontWeight="bold">
            {item.author.username}
          </Text>

          <Text color="white" fontSize={12} marginTop={8}>
            {item.tags.map((tag, index) => (
              <Text
                key={index}
                color="white"
                fontSize={12}
                style={{ marginRight: 8 }}
              >
                #{tag}
              </Text>
            ))}
          </Text>
          <Text color="white">
            {new Date(Number(item.createdAt)).toLocaleString().split(",")[0]}
          </Text>
        </YStack>
      </XStack>
      <View marginHorizontal={20}>
        <Text color="white" fontSize={12} style={{ width: "90%" }}>
          {item.content}
        </Text>
      </View>

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
        <XStack gap={8} alignItems="center">
          <TouchableOpacity onPress={() => handleLike(item._id)}>
            <AntDesign
              name={isLikedByUser(item.likes) ? "like1" : "like2"}
              size={24}
              color="white"
            />
          </TouchableOpacity>
          <Text color="white">{item.likes?.length || "0"}</Text>
        </XStack>
        <TouchableOpacity
          onPress={() => navigation.navigate("Detail", { id: item._id })}
        >
          <XStack gap={8} alignItems="center">
            <MaterialCommunityIcons
              name="comment-multiple-outline"
              size={24}
              color="white"
            />
            <Text color="white">{item.comments?.length || "0"}</Text>
          </XStack>
        </TouchableOpacity>
      </XStack>
    </YStack>
  );
}
