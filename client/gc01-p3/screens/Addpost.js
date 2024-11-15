import { useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { Alert } from "react-native";
import { Button, Form, Input, Text, View, YStack, XStack } from "tamagui";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../context/auth";
import { ActivityIndicator } from "react-native-paper";
import { ADD_POST, GET_POST } from "../operations/post";

export function AddPost() {
  const navigation = useNavigation();
  const [content, setContent] = useState({
    content: "",
    imgUrl: "",
    tags: "",
  });

  const[addPost,{loading,error,data}] = useMutation(ADD_POST,{
    refetchQueries:[
        {
            query:GET_POST
        }
    ]
  })

  const handleChange = (name, value) => {
    setContent((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
    // console.log(content);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="white" />;
  }
  if (error) {
    Alert.alert("Error", error.message);
  }

  const handelSubmit = async () => {
    try {
        await addPost({variables:content})
        setContent({
          content: "",
          imgUrl: "",
          tags: "",
        });
        console.log(content,"afterReset");
        
        navigation.navigate("Home")
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  return (
    <View
      backgroundColor="black"
      height="100%"
      justifyContent="center"
      alignItems="center"
    >
      <YStack
        backgroundColor="#2e2e2e"
        padding={30}
        borderRadius={8}
        width="90%"
        maxWidth={400}
        shadowColor="black"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.5}
        shadowRadius={8}
      >
        <Text
          color="#c7c7c7"
          fontSize={24}
          fontWeight="bold"
          marginBottom={24}
          textAlign="center"
        >
          Add Post
        </Text>

        <Form gap="16">
          <Input
            backgroundColor="#3a3a3a"
            color="#c7c7c7"
            placeholder="Content"
            placeholderTextColor="#777"
            borderRadius={8}
            padding={12}
            onChangeText={(text) => handleChange("content", text)}
            value={content.content}
          />
          <Input
            backgroundColor="#3a3a3a"
            color="#c7c7c7"
            placeholder="Tags"
            placeholderTextColor="#777"
            borderRadius={8}
            padding={12}
            onChangeText={(text) => handleChange("tags", text)}
            value={content.tags}
          />
          <Input
            backgroundColor="#3a3a3a"
            color="#c7c7c7"
            placeholder="Img Url"
            placeholderTextColor="#777"
            borderRadius={8}
            padding={12}
            onChangeText={(text) => handleChange("imgUrl", text)}
            value={content.imgUrl}
          />
          <Form.Trigger>
            <Button
              theme="active"
              backgroundColor="#565656"
              color="white"
              marginTop="20"
              borderRadius={8}
              padding={10}
              onPress={handelSubmit}
            >
              Create
            </Button>
          </Form.Trigger>
        </Form>
      </YStack>
    </View>
  );
}
