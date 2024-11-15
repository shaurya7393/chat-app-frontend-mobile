import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {FlatList, Image, Pressable, Text, View} from 'react-native';
import {useGetAllUserFriends} from '../query/user';
import useChatStore from '../store/store';

const messages = [
  {
    _id: '1',
    name: 'User One',
    lastMessage: 'Hello!',
    timestamp: '10:30 AM',
    image:
      'https://i0.wp.com/picjumbo.com/wp-content/uploads/silhouette-of-a-guy-with-a-cap-at-red-sky-sunset-free-image.jpeg?h=800&quality=80',
  },
  {
    _id: '2',
    name: 'User Two',
    lastMessage: 'How are you?',
    timestamp: '10:31 AM',
    image:
      'https://i0.wp.com/picjumbo.com/wp-content/uploads/silhouette-of-a-guy-with-a-cap-at-red-sky-sunset-free-image.jpeg?h=800&quality=80',
  },
  // Add more users
];
function MessageScreen() {
  const navigation = useNavigation();
  const {userId} = useChatStore();
  const {data: getAllFriends} = useGetAllUserFriends(userId);
  console.log(getAllFriends);
  const renderMessageItem = ({item}) => (
    <Pressable
      className="flex-row items-center bg-gray-100 p-4 rounded-lg mb-2"
      onPress={() => navigation.navigate('Chat', {receiverId: item._id})}>
      <View className="flex-row items-center flex-1">
        <Image
          source={{uri: item.image}}
          className="w-12 h-12 rounded-full mr-3"
        />
        <View>
          <Text className="font-bold">{item.name}</Text>
          <Text className="text-gray-600">{item.lastMessage}</Text>
        </View>
      </View>
      <Text className="text-gray-500 text-xs">{item.timestamp}</Text>
    </Pressable>
  );

  return (
    <View className="flex-1">
      <FlatList
        data={getAllFriends}
        renderItem={renderMessageItem}
        keyExtractor={item => item._id}
      />
    </View>
  );
}

export default MessageScreen;
