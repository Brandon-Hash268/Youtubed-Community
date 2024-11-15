import { useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { Alert } from "react-native";
import { Button, Form, Input, Text, View, YStack, XStack } from "tamagui";
import { LOGIN } from "../operations/user";
import * as SecureStore from "expo-secure-store"
import { AuthContext } from "../context/auth";
import { ActivityIndicator } from "react-native-paper";

export function Login() {
  const navigation = useNavigation();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [login, { loading, error, data }] = useMutation(LOGIN);
  // console.log(data);
  

  const handleChange = (name, value) => {
    setUser((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
    console.log(user);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="white" />;
  }
  if (error) {
    Alert.alert("Error", error.message);
  }

  const authContext = useContext(AuthContext)

  const handelSubmit = async () => {
    try {
      const {data} = await login({ variables: user });
      // await console.log(data.login.username);
      await SecureStore.setItemAsync("access_token",data.login.access_token)
      await SecureStore.setItemAsync("username",data.login.username)
      await SecureStore.setItemAsync("userId", String(data.login.userId));
      // console.log(await SecureStore.getItemAsync("access_token"),"aaaaaaaaaaaaaaaa");
      authContext.setSignedIn(true)
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
          Sign In
        </Text>

        <Form gap="16">
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
              onPress={handelSubmit}
            >
              Sign In
            </Button>
          </Form.Trigger>
        </Form>

        <XStack justifyContent="center" marginTop={20}>
          <Text color="#777">Doesn't have an account?</Text>
          <Text
            color="#4a90e2"
            fontWeight="bold"
            marginLeft={4}
            onPress={() => navigation.navigate("Register")}
          >
            Sign Up
          </Text>
        </XStack>
      </YStack>
    </View>
  );
}
