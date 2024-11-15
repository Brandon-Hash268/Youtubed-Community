import { Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import { Button, Input, View, XStack, Text } from "tamagui";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { SEARCH_USER, FOLLOW } from "../operations/user";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

export function Search() {
  const navigation = useNavigation();
  const [searchUser, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [username, setUsername] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const { refetch } = useQuery(SEARCH_USER, {
    variables: { username: searchUser },
    skip: true,
  });

  const [follow] = useMutation(FOLLOW, {
    refetchQueries: [{ query: SEARCH_USER }], // Optionally refetch after mutation
  });

  // Fetch username from SecureStore
  useEffect(() => {
    const fetchUsername = async () => {
      const user = await SecureStore.getItemAsync("username");
      setUsername(user);
    };
    fetchUsername();
  }, []);

  const handleSearch = async () => {
    if (!searchUser.trim()) {
      Alert.alert("Error", "Please enter a username to search.");
      return;
    }

    try {
      setIsSearching(true);
      const { data } = await refetch({ username: searchUser });
      setResults(data?.searchUser || []);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSearching(false);
    }
  };

  const isFollowed = (followedList) => {
    if (!followedList || !username) return false;
    return followedList.some((follow) => follow.username === username);
  };

  const handleFollow = async (id) => {
    try {
      await follow({
        variables: { followingId: id },
      });
    //   Alert.alert("Success", "Follow status updated.");
      const { data } = await refetch({ username: searchUser });
      setResults(data?.searchUser || []);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View backgroundColor="black" height="100%" padding={16}>
      {/* Search Input */}
      <XStack justifyContent="center" alignItems="center" marginBottom={20}>
        <Input
          onChangeText={setSearch}
          placeholder="Search..."
          width="80%"
          backgroundColor="white"
          color="black"
          placeholderTextColor="gray"
        />
        <Button
          onPress={handleSearch}
          style={{
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            marginLeft: 10,
          }}
        >
          <AntDesign name="search1" size={24} color="black" />
        </Button>
      </XStack>

      {/* Loading Indicator */}
      {isSearching && <ActivityIndicator size="large" color="white" />}

      {/* Search Results */}
      {!isSearching && results.length > 0 && (
        <View>
          <Text color="white" fontSize={20} marginBottom={10}>
            Results:
          </Text>
          {results.map((user) => (
            <XStack
              key={user._id}
              marginBottom={16}
              justifyContent="space-between"
              borderBottomWidth={1}
              borderBottomColor="rgba(219, 219, 219, 0.3)"
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("Profile", { id: user._id })}
              >
                <XStack gap={10} justifyContent="center" alignContent="center">
                  <View
                    backgroundColor="white"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius={50}
                    height={50}
                    width={50}
                    marginBottom={8}
                  >
                    <Text fontSize={16} fontWeight="bold" color="black">
                      {user.username}
                    </Text>
                  </View>
                  <View>
                    <Text color="white">{user.email}</Text>
                    <Text color="white">{user.name}</Text>
                  </View>
                </XStack>
              </TouchableOpacity>

              {/* Follow/Unfollow Button */}
              {username !== user.username && (
                <Button
                  backgroundColor={
                    isFollowed(user.followers) ? "grey" : "#EF0808"
                  }
                  onPress={() => handleFollow(user._id)}
                >
                  {isFollowed(user.followers) ? "Unsubscribe" : "Subscribe"}
                </Button>
              )}
            </XStack>
          ))}
        </View>
      )}

      {/* No Results */}
      {!isSearching && results.length === 0 && searchUser.trim() && (
        <Text color="gray" textAlign="center">
          No users found.
        </Text>
      )}
    </View>
  );
}
