import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createTamagui, TamaguiProvider, Text } from "tamagui";
import defaultConfig from "@tamagui/config/v3";
import { HomeScreen } from "./screens/HomeScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Register } from "./screens/Register";
import { Login } from "./screens/Login";
import { AddPost } from "./screens/Addpost";
import { ApolloProvider } from "@apollo/client";
import { client } from "./config/apollo";
import { useEffect, useState } from "react";
import { AuthContext } from "./context/auth";
import * as SecureStore from "expo-secure-store";
import { Detail } from "./screens/Detail";
import { TouchableOpacity } from "react-native";

export default function App() {
  const [signedIn, setSignedIn] = useState(false);

  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();
  const config = createTamagui(defaultConfig);

  const styleHeader = {
    headerStyle: {
      backgroundColor: "black",
    },
    headerTitleStyle: {
      color: "white",
      fontSize: 20,
      fontWeight: "bold",
    },
    headerTintColor: "white",
  };

  useEffect(() => {
    const token = SecureStore.getItem("access_token");
    if (token) {
      setSignedIn(true);
    }
  }, []);

  function HomeTabs() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
              return <Ionicons name={iconName} size={size} color={color} />;
            } else if (route.name === "AddPost") {
              iconName = focused ? "pluscircle" : "pluscircleo";
              return <AntDesign name={iconName} size={size} color={color} />;
            }

            // You can return any component that you like here!
          },
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: "black",
          },
          // tabBarLabelStyle: {
          //   color: "white", // White color for the label text
          //   fontSize: 14, // Font size of the label text
          //   fontWeight: "bold", // Bold label text
          // },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            ...styleHeader,
            headerRight: () => (
              <TouchableOpacity
                onPress={async () => {
                  await SecureStore.deleteItemAsync("access_token");
                  setSignedIn(false);
                }}
              >
                <Text style={{ color: "red", marginRight: 10 }}>Logout</Text>
              </TouchableOpacity>
            ),
          }}
        />
        <Tab.Screen name="AddPost" component={AddPost} options={styleHeader} />
      </Tab.Navigator>
    );
  }

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider
        value={{
          signedIn,
          setSignedIn,
        }}
      >
        <TamaguiProvider config={config}>
          <NavigationContainer>
            <Stack.Navigator>
              {!signedIn ? (
                <>
                  <Stack.Screen
                    name="Login"
                    component={Login}
                    options={styleHeader}
                  />
                  <Stack.Screen
                    name="Register"
                    component={Register}
                    options={styleHeader}
                  />
                </>
              ) : (
                <>
                  <Stack.Screen
                    name="Home"
                    component={HomeTabs}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="Detail"
                    component={Detail}
                    options={styleHeader}
                  />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </TamaguiProvider>
      </AuthContext.Provider>
    </ApolloProvider>
  );
}
