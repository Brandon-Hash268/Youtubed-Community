import React, { useState } from "react";
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
import { useRoute } from "@react-navigation/native";
import { FOLLOW, GET_USER } from "../operations/user";
import { GET_POST_BY_USER } from "../operations/post";
import { RenderedItem } from "../components/PostCom";
import * as SecureStore from "expo-secure-store";

export function Profile() {
  const username = SecureStore.getItem("username");

  const { params } = useRoute();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState([]); // To store the list of followers or following
  const [modalTitle, setModalTitle] = useState(""); // To set the modal title
  const [follow] = useMutation(FOLLOW, {
    refetchQueries: [
      {
        query: GET_USER,
        variables: { userId: params.id },
      },
    ],
  }); 

  const { loading, error, data } = useQuery(GET_USER, {
    variables: {
      userId: params.id,
    },
  });

  const {
    loading: loading2,
    error: error2,
    data: data2,
  } = useQuery(GET_POST_BY_USER, {
    variables: {
      userId: params.id,
    },
  });

  if (loading || loading2) {
    return <ActivityIndicator size="large" color="white" />;
  }

  if (error || error2) {
    return Alert.alert("Error", error.message);
  }

  const user = data.getUserById;
  const post = data2.getPostByUserId;

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
    if (!followed || !username) return null;
    return followed.some((follow) => follow.username === username);
  };

  const handlefollow =async()=>{
    try {
        await follow({
          variables: {
            followingId: params.id,
          },
        });
    } catch (error) {
        Alert.alert("Error", error.message);
    }
  }

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
        <View marginTop={10}>
          {isfollowed(user.followers) ? (
            <Button backgroundColor="white" onPress={handlefollow}>
              UnSubscribe
            </Button>
          ) : (
            <Button backgroundColor="#e61c1c" onPress={handlefollow}>
              Subscribe
            </Button>
          )}
        </View>
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
                <YStack style={styles.listItem}>
                  <Text style={styles.listText}>{item.username}</Text>
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
