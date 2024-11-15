import { NavigationContainer, useNavigation } from "@react-navigation/native";
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
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/auth";
import * as SecureStore from "expo-secure-store";
import { Detail } from "./screens/Detail";
import { TouchableOpacity } from "react-native";
import { Profile } from "./screens/Profile";
import { Search } from "./screens/Search";
import { SelfProfile } from "./screens/SelfProfile";

const Tab = createBottomTabNavigator();
  const userId = SecureStore.getItem("userId")

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

function HomeTabs() {
  const authContext = useContext(AuthContext);
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("access_token");
    await SecureStore.deleteItemAsync("username");
    await SecureStore.deleteItemAsync("userId");
    authContext.setSignedIn(false);
  };
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
          } else if (route.name === "SelfProfile") {
            iconName = focused ? "user" : "user";
            return <AntDesign name={iconName} size={size} color={color} />;
          } else if (route.name === "Search") {
            iconName = focused ? "search1" : "search1";
            return <AntDesign name={iconName} size={size} color={color} />;
          }

          // You can return any component that you like here!
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "black",
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          ...styleHeader,
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout}>
              <Text style={{ color: "red", marginRight: 10 }}>Logout</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen name="AddPost" component={AddPost} options={styleHeader} />
      <Tab.Screen
        name="SelfProfile"
        component={SelfProfile}
        options={styleHeader}
      />
      <Tab.Screen name="Search" component={Search} options={styleHeader} />
    </Tab.Navigator>
  );
}

export default function App() {
  // const navigation = useNavigation()
  const [signedIn, setSignedIn] = useState(false);

  const Stack = createNativeStackNavigator();
  const config = createTamagui(defaultConfig);
  console.log(userId);
  

  useEffect(() => {
    const token = SecureStore.getItem("access_token");
    if (token) {
      setSignedIn(true);
    }
  }, []);

  

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
                  <Stack.Screen
                    name="Profile"
                    component={Profile}
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
