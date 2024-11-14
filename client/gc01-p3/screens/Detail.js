import { useMutation, useQuery } from "@apollo/client";
import { useRoute } from "@react-navigation/native";
import { COMMENT, GET_POST, GET_POST_DETAIL, LIKE } from "../operations/post";
import { Button, Image, Input, ScrollView, Text, View, XStack, YStack } from "tamagui";
import { TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as SecureStore from "expo-secure-store";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ActivityIndicator } from "react-native-paper";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";

export function Detail() {
  const { params } = useRoute();
  const [content, setContent] = useState("");
  const username = SecureStore.getItem("username");
  const { loading, error, data } = useQuery(GET_POST_DETAIL, {
    variables: {
      getPostByIdId: params.id,
    },
  });

  const [like, {}] = useMutation(LIKE);
  const [comment, {}] = useMutation(COMMENT, {
    refetchQueries: [
      {
        query: GET_POST_DETAIL,
        variables: { getPostByIdId: params.id }, // Use this if your query uses `getPostByIdId`
      },
    ],
  });


  if (loading) {
    return <ActivityIndicator size="large" color="white" />;
  }
  if (error) {
    Alert.alert("Error", error.message);
  }

  const item = data.getPostById;

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

  const handleComment = async () => {
    try {
      await comment({
        variables: {
          content: content,
          postId: item._id,
        }
      });
      setContent("")
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <YStack
        key={item._id}
        backgroundColor="black"
        overflow="hidden"
        borderBottomWidth={1}
        borderBottomColor="rgba(219, 219, 219, 0.3)"
      >
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
            <Text fontSize={16} fontWeight="bold" color="black">
              {item.author.username}
            </Text>
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
            <Text color="white" fontSize={12} marginTop={8}>
              {item.content}
            </Text>
          </YStack>
        </XStack>

        <Image
          src={item.imgUrl}
          alt={item.content}
          width="100%"
          height={200}
          resizeMode="contain"
        />

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

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <XStack width="100%" marginBottom={12}>
          <Input
            placeholder="Add a comment..."
            width="80%"
            value={content}
            onChangeText={(text) => setContent(text)}
          />
          <Button onPress={handleComment}>
            <FontAwesome name="send" size={24} color="black" />
          </Button>
        </XStack>
        {item.comments && item.comments.length > 0 ? (
          item.comments.map((comment) => (
            <ScrollView
              key={comment._id}
              padding={8}
              borderBottomWidth={1}
              borderBottomColor="rgba(219, 219, 219, 0.3)"
              backgroundColor={
                comment.username === username
                  ? "rgba(255, 255, 255, 0.1)"
                  : "transparent"
              }
              borderRadius={4}
            >
              <ScrollView>
                <Text color="white" fontWeight="bold" fontSize={14}>
                  {comment.username}
                </Text>
                <Text color="gray" fontSize={10}>
                  {new Date(Number(comment.createdAt)).toLocaleString()}
                </Text>
                <Text color="white" fontSize={14} marginTop={10}>
                  {comment.content}
                </Text>
              </ScrollView>
            </ScrollView>
          ))
        ) : (
          <Text color="gray" textAlign="center" marginTop={12}>
            No comments yet. Be the first to comment!
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
