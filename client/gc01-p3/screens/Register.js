import { useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Alert } from "react-native";
import { Button, Form, Input, Text, View, YStack, XStack } from "tamagui";
import { REGISTER } from "../operations/user";

export function Register() {
  const navigation = useNavigation();
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (name, value) => {
    setUser((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
    console.log(user);
  };

  const [register, { loading, error, data }] = useMutation(REGISTER);

  const handleSubmit = async () => {
    console.log("aaa");

    try {
      await register({
        variables: user,
      });
      navigation.navigate("Login");
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error);

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
          Sign Up
        </Text>

        <Form gap="16">
          <Input
            name="name"
            backgroundColor="#3a3a3a"
            color="#c7c7c7"
            placeholder="Name"
            placeholderTextColor="#777"
            borderRadius={8}
            padding={12}
            onChangeText={(text) => handleChange("name", text)}
            value={user.name}
          />
          <Input
            name="username"
            backgroundColor="#3a3a3a"
            color="#c7c7c7"
            placeholder="Username"
            placeholderTextColor="#777"
            borderRadius={8}
            padding={12}
            onChangeText={(text) => handleChange("username", text)}
            value={user.username}
          />
          <Input
            name="email"
            backgroundColor="#3a3a3a"
            color="#c7c7c7"
            placeholder="Email"
            placeholderTextColor="#777"
            borderRadius={8}
            padding={12}
            onChangeText={(text) => handleChange("email", text)}
            value={user.email}
          />
          <Input
            name="password"
            backgroundColor="#3a3a3a"
            color="#c7c7c7"
            placeholder="Password"
            placeholderTextColor="#777"
            secureTextEntry
            borderRadius={8}
            padding={12}
            onChangeText={(text) => handleChange("password", text)}
            value={user.password}
          />
          <Form.Trigger>
            <Button
              theme="active"
              backgroundColor="#565656"
              color="white"
              marginTop="20"
              borderRadius={8}
              padding={10}
              onPress={handleSubmit}
            >
              Sign Up
            </Button>
          </Form.Trigger>
        </Form>

        <XStack justifyContent="center" marginTop={20}>
          <Text color="#777">Already have an account?</Text>
          <Text
            color="#4a90e2"
            fontWeight="bold"
            marginLeft={4}
            onPress={() => navigation.navigate("Login")}
          >
            Sign In
          </Text>
        </XStack>
      </YStack>
    </View>
  );
}
