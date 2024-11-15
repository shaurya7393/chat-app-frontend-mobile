import React from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import {JwtPayload} from 'jwt-decode';
import {
  useActionFriendRequest,
  useGetOtherUsers,
  useGetUserFriendRequests,
  useSendFriendRequest,
} from '../query/user';
import {FriendRequestBody, User} from '../types/types';
import useChatStore from '../store/store';

// Extend JwtPayload to include userId
export interface CustomJwtPayload extends JwtPayload {
  userId: string; // Define the userId property
}

function FriendsScreen() {
  const {userId} = useChatStore();
  const {data: otherUsers} = useGetOtherUsers(userId);
  const {data: friendRequests} = useGetUserFriendRequests(userId);
  const {mutateAsync: sendFriendRequest} = useSendFriendRequest();
  const {mutateAsync: actionFriendRequest} = useActionFriendRequest();
  console.log(friendRequests);

  async function handleRequest(recipientId: string) {
    const body: FriendRequestBody = {
      senderId: userId,
      recipientId,
    };
    await sendFriendRequest(body);
  }

  async function actionOnFriendRequest(senderId: string, action: string) {
    if (action === 'accept') {
      await actionFriendRequest({
        senderId: senderId,
        recipientId: userId,
        action: 'accept',
      });
      return;
    }

    if (action === 'deny') {
      await actionFriendRequest({
        senderId: senderId,
        recipientId: userId,
        action: 'deny',
      });
      return;
    }
  }

  const renderItem = ({item}: {item: User}) => {
    return (
      <View className="flex-row items-center bg-gray-100 p-4 rounded-lg mb-2">
        <Image
          source={{
            uri: 'https://i0.wp.com/picjumbo.com/wp-content/uploads/silhouette-of-a-guy-with-a-cap-at-red-sky-sunset-free-image.jpeg?h=800&quality=80',
          }}
          className="w-12 h-12 rounded-full mr-4"
        />
        <View className="flex-1">
          <Text className="font-bold">{item.name}</Text>
          <Text className="text-gray-500 opacity-70">{item.email}</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleRequest(item._id)}
          className="bg-blue-600 p-2 rounded">
          <Text className="text-white">Add Friend</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderFriendRequest = ({item}: {item: User}) => {
    const actions = ['Accept', 'Deny'];
    return (
      <View className="flex-row items-center bg-gray-100 p-4 rounded-lg mb-2">
        <Image
          source={{
            uri: 'https://i0.wp.com/picjumbo.com/wp-content/uploads/silhouette-of-a-guy-with-a-cap-at-red-sky-sunset-free-image.jpeg?h=800&quality=80',
          }}
          className="w-12 h-12 rounded-full mr-4"
        />
        <View className="flex-1">
          <Text className="font-bold">{item.name}</Text>
          <Text className="text-gray-500 opacity-70">{item.email}</Text>
        </View>
        <View className="flex-row">
          {actions.map(action => (
            <TouchableOpacity
              key={action}
              onPress={() =>
                actionOnFriendRequest(item._id, action.toLowerCase())
              }
              className={
                action === 'Accept'
                  ? 'bg-blue-600 p-2 rounded mr-2'
                  : 'bg-yellow-400 p-2 rounded'
              }>
              <Text className="text-white">{action}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-semibold">Friend Requests</Text>
      <FlatList
        data={friendRequests}
        renderItem={renderFriendRequest}
        keyExtractor={item => item._id} // Adjust based on your data structure
      />

      <Text className="text-2xl font-semibold">Add Friends</Text>
      <FlatList
        data={otherUsers}
        renderItem={renderItem}
        keyExtractor={item => item._id} // Adjust based on your data structure
      />
    </View>
  );
}

export default FriendsScreen;
