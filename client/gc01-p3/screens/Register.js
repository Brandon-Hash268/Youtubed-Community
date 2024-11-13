import { useNavigation } from "@react-navigation/native";
import { Button, Form, Input, Text, View, YStack, XStack } from "tamagui";

export function Register() {
    const navigation = useNavigation()
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
            backgroundColor="#3a3a3a"
            color="#c7c7c7"
            placeholder="Name"
            placeholderTextColor="#777"
            borderRadius={8}
            padding={12}
          />
          <Input
            backgroundColor="#3a3a3a"
            color="#c7c7c7"
            placeholder="Username"
            placeholderTextColor="#777"
            borderRadius={8}
            padding={12}
          />
          <Input
            backgroundColor="#3a3a3a"
            color="#c7c7c7"
            placeholder="Email"
            placeholderTextColor="#777"
            borderRadius={8}
            padding={12}
          />
          <Input
            backgroundColor="#3a3a3a"
            color="#c7c7c7"
            placeholder="Password"
            placeholderTextColor="#777"
            secureTextEntry
            borderRadius={8}
            padding={12}
          />

          <Button
            theme="active"
            backgroundColor="#565656"
            color="white"
            marginTop="20"
            borderRadius={8}
            padding={12}
          >
            Sign Up
          </Button>
        </Form>

        <XStack justifyContent="center" marginTop={20}>
          <Text color="#777">Already have an account?</Text>
          <Text color="#4a90e2" fontWeight="bold" marginLeft={4} onPress={()=> navigation.navigate("Login")}>
            Sign In
          </Text>
        </XStack>
      </YStack>
    </View>
  );
}
