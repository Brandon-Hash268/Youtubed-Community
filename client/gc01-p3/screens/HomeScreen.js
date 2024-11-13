import { FlatList, View } from "react-native";
import { ScrollView, Text, Image, YStack, XStack } from "tamagui";

export function HomeScreen(params) {
 const data = [
   {
     _id: 1,
     content: "Sport Highlights",
     description: "Check out these epic moments from the sports world!",
     tags: ["sport", "fun", "highlights"],
     imgUrl: "https://picsum.photos/id/237/200/300",
     avatarUrl: "https://i.pravatar.cc/100?img=1",
   },
   {
     _id: 2,
     content: "Music Festival Vibes",
     description: "Vibe with the best moments from the latest music festivals!",
     tags: ["music", "party", "festival"],
     imgUrl: "https://picsum.photos/id/239/200/300",
     avatarUrl: "https://i.pravatar.cc/100?img=2",
   },
   {
     _id: 3,
     content: "Funny Moments Compilation",
     description:
       "Laugh out loud with this hilarious compilation of funny moments!",
     tags: ["comedy", "fun", "laugh"],
     imgUrl: "https://picsum.photos/id/241/200/300",
     avatarUrl: "https://i.pravatar.cc/100?img=3",
   },
   {
     _id: 4,
     content: "Amazing Nature Views",
     description: "Get lost in these breathtaking nature scenes.",
     tags: ["nature", "travel", "landscape"],
     imgUrl: "https://picsum.photos/id/243/200/300",
     avatarUrl: "https://i.pravatar.cc/100?img=4",
   },
   {
     _id: 5,
     content: "Technology and Innovation",
     description: "Discover the latest advancements in tech and innovation!",
     tags: ["tech", "innovation", "future"],
     imgUrl: "https://picsum.photos/id/245/200/300",
     avatarUrl: "https://i.pravatar.cc/100?img=5",
   },
 ];

 const renderedItem = ({item})=>(
    <YStack
      key={item._id}
      backgroundColor="black"
      overflow="hidden"
    >
      {/* Video Thumbnail */}
      <Image
        src={item.imgUrl}
        alt={item.content}
        width="100%"
        height={200}
      />

      {/* Content and Tags */}
      <XStack>
        <View alignItems="center" justifyContent="center" marginLeft={20}>
          <Image
            src={item.avatarUrl} 
            alt="Profile"
            width={40} 
            height={40} 
            borderRadius={20} 
          />
        </View>

        <YStack padding={12}>
          <Text color="white" fontSize={16} fontWeight="bold">
            {item.content}
          </Text>
          <Text color="white" fontSize={12} marginTop={8}>
            {/* Join tags with a space between them */}
            {item.tags.map((tag, index) => (
              <Text
                key={index}
                color="white"
                fontSize={12}
                style={{ marginRight: 8 }}
              >
                #{tag}
                {/* Add a space or separator between tags */}
                {index < item.tags.length - 1 && " "}
              </Text>
            ))}
          </Text>
        </YStack>
      </XStack>
    </YStack>
 )

  return (
    <FlatList
      data={data} // Pass the data here
      renderItem={renderedItem} // Pass the renderItem function
      keyExtractor={(item) => item._id.toString()} // Ensure keyExtractor is used
    />
  );
}
