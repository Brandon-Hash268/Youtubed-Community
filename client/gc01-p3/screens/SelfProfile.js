import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Button, Text, View, XStack, YStack } from "tamagui";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FOLLOW, GET_USER } from "../operations/user";
import { GET_POST_BY_USER } from "../operations/post";
import { RenderedItem } from "../components/PostCom";
import * as SecureStore from "expo-secure-store";

export function SelfProfile() {
  const navigation = useNavigation();
  const username = SecureStore.getItem("username");
  const userId = SecureStore.getItem("userId")

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState([]); // To store the list of followers or following
  const [modalTitle, setModalTitle] = useState(""); // To set the modal title
  const [follow] = useMutation(FOLLOW, {
    refetchQueries: [
      {
        query: GET_USER,
        variables: { userId },
      },
    ],
  });

  const { loading, error, data } = useQuery(GET_USER, {
    variables: {
      userId: userId,
    },
  });

  const {
    loading: loading2,
    error: error2,
    data: data2,
  } = useQuery(GET_POST_BY_USER, {
    variables: {
      userId,
    },
  });


  // console.log(user);

  // Open modal with the respective list
  const openModal = (type) => {
    if (type === "followers") {
      setModalContent(user.followers || []);
      setModalTitle("Subscribers");
    } else if (type === "following") {
      setModalContent(user.following || []);
      setModalTitle("Subscribing");
    }
    setModalVisible(true);
  };

  const isfollowed = (followed) => {
    // console.log(followed[0].username,username);

    if (!followed || !username) return null;
    return followed.some((follow) => follow.username === username);
  };

  const handlefollow = async (id) => {
    try {
      await follow({
        variables: {
          followingId: id,
        },
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  

  useEffect(() => {
      if (modalTitle == "Subscribers") {
          setModalContent(user.followers);
        } else if (modalTitle == "Subscribing") {
            setModalContent(user.following);
        }
    }, [user, modalTitle]);

    if (loading || loading2) {
      return <ActivityIndicator size="large" color="white" />;
    }
  
    if (error || error2) {
      return Alert.alert("Error", error.message);
    }
  
    const user = data.getUserById;
    const post = data2.getPostByUserId;
    
  return (
    <View backgroundColor="black" height="100%" padding={16}>
      <YStack alignItems="center" marginBottom={20}>
        {/* User Information */}
        <Text color="white" fontSize={24} fontWeight="bold">
          {user.username}
        </Text>
        <Text color="gray" fontSize={16}>
          {user.bio || "No bio available"}
        </Text>
        {username !== user.username && (
          <View marginTop={10}>
            {isfollowed(user.followers) ? (
              <Button
                backgroundColor="white"
                onPress={() => handlefollow(userId)}
              >
                UnSubscribe
              </Button>
            ) : (
              <Button
                backgroundColor="#EF0808"
                onPress={() => handlefollow(userId)}
              >
                Subscribe
              </Button>
            )}
          </View>
        )}
      </YStack>

      {/* Subscriber/Subscribing Card */}
      <XStack justifyContent="space-around" marginBottom={20}>
        {/* Subscribers */}
        <TouchableOpacity onPress={() => openModal("followers")}>
          <YStack alignItems="center">
            <Text color="white" fontSize={18} fontWeight="bold">
              {user.followers ? user.followers.length : "0"}
            </Text>
            <Text color="gray">Subscribers</Text>
          </YStack>
        </TouchableOpacity>

        {/* Subscriptions */}
        <TouchableOpacity onPress={() => openModal("following")}>
          <YStack alignItems="center">
            <Text color="white" fontSize={18} fontWeight="bold">
              {user.following ? user.following.length : "0"}
            </Text>
            <Text color="gray">Subscribing</Text>
          </YStack>
        </TouchableOpacity>
      </XStack>

      {/* Additional User Content */}
      <Text color="white" fontSize={20} fontWeight="bold" marginBottom={10}>
        User Posts
      </Text>
      <FlatList
        style={{ backgroundColor: "black" }}
        data={post}
        renderItem={({ item }) => <RenderedItem item={item} />}
        keyExtractor={(item) => item._id.toString()}
      />

      {/* Modal for Subscribers/Subscriptions */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <FlatList
              data={modalContent}
              renderItem={({ item }) => (
                <YStack
                  style={styles.listItem}
                  justifyContent="center"
                  alignItems="center"
                >
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("Profile", { id: item._id });
                      setModalVisible(false);
                    }}
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View
                      backgroundColor="black"
                      width={50}
                      height={50}
                      justifyContent="center"
                      alignContent="center"
                      style={{ borderRadius: 25 }}
                    >
                      <Text color="white" textAlign="center">
                        {item.username}
                      </Text>
                    </View>
                    {username !== item.username && (
                      <View marginTop={10}>
                        {isfollowed([item]) ? (
                          <>
                            {/* {console.log(item, "aaaaaa")} */}
                            <Button
                              backgroundColor="grey"
                              onPress={() => handlefollow(item._id)}
                            >
                              UnSubscribe
                            </Button>
                          </>
                        ) : (
                          <>
                            {console.log(isfollowed([item]), item, "aaaaaa")}
                            <Button
                              backgroundColor="#EF0808"
                              onPress={() => handlefollow(item._id)}
                            >
                              Subscribe
                            </Button>
                          </>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                </YStack>
              )}
              keyExtractor={(item) => item._id.toString()}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  listItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  listText: {
    fontSize: 16,
    color: "black",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "black",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});
