import React, {useState, useEffect} from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation, useRoute} from '@react-navigation/native';
import useChatStore from '../store/store';
import {useGetMessages, useGetUserData} from '../query/user';
import {io, Socket} from 'socket.io-client';
import Moment from 'moment';

function ChatScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const {receiverId} = route.params;
  const {userId} = useChatStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  // const {mutateAsync: sendMessage} = useSendMessages();
  const {data: messages, refetch: refetchMessages} = useGetMessages(
    userId,
    receiverId,
  );

  console.log(userId);

  const {data: receiverData} = useGetUserData(receiverId);

  // Initialize socket connection on component mount
  useEffect(() => {
    const socketConnection = io('http://10.0.2.2:8000', {
      transports: ['websocket'], // Use WebSocket for better performance
      withCredentials: true,
    });

    socketConnection.emit('registerSocket', userId);

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, [userId, receiverId, refetchMessages]);

  // Send a message
  const sendMessage = (messageData: {
    senderId: string;
    recipientId: any;
    message: string;
    messageType: string;
  }) => {
    if (socket) {
      socket.emit('sendMessage', messageData);
      refetchMessages();
    }
  };

  const receiverProfilePic = 'https://via.placeholder.com/150';
  const receiverName = receiverData?.name || 'John';

  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetchMessages();
    });
    return unsubscribe;
  }, [navigation, refetchMessages]);

  async function handleSend(messageType: string) {
    if (message.trim()) {
      const body = {
        senderId: userId,
        recipientId: receiverId,
        message,
        messageType,
        // imageUrl,
      };

      sendMessage(body);
      setMessage('');
    }
  }

  const renderMessages = () => {
    let lastDate = '';
    return messages?.map((msg, index) => {
      const isCurrentUser = msg.senderId === userId;
      // Format the timestamp and check for day change
      const messageDate = Moment(msg.timestamp);
      const formattedDate = messageDate.format('YYYY-MM-DD');

      // If the date has changed, render the new date
      const showDate = formattedDate !== lastDate;

      // Update last rendered date
      if (showDate) {
        lastDate = formattedDate;
      }
      return (
        <View className="w-full relative">
          {showDate && (
            <View className="my-2 w-full flex justify-center items-center">
              <View className="rounded-xl bg-white border-gray-20 px-4 py-1">
                <Text className="text-gray-600 text-lg font-semibold text-center">
                  {Moment(messageDate).format('MMMM D, YYYY')}
                </Text>
              </View>
            </View>
          )}

          <View
            key={index}
            className={`flex-row ${
              isCurrentUser ? 'justify-end' : 'justify-start'
            } my-1`}>
            <View
              className={`relative max-w-[80%] px-3 py-2 rounded-lg
              ${isCurrentUser ? 'bg-[#DCF8C6]' : 'bg-white'}
              ${isCurrentUser ? 'rounded-tr-none' : 'rounded-tl-none'}
              ${isCurrentUser ? 'mr-2' : 'ml-2'}
              shadow-sm`}>
              {/* Message triangle */}
              <View
                className={`absolute top-0 w-0 h-0 border-8 border-transparent
                ${
                  isCurrentUser
                    ? 'right-[-8px] border-l-[#DCF8C6]'
                    : 'left-[-8px] border-r-white'
                }`}
              />
              <Text className="text-base text-black">{msg.message}</Text>
              <Text
                className={`text-xs text-gray-500 mt-1 ${
                  isCurrentUser ? 'text-right' : 'text-left'
                }`}>
                {Moment(msg.timestamp).format('hh:mm a')}
              </Text>
            </View>
          </View>
        </View>
      );
    });
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-[#ECE5DD]" behavior="padding">
      {/* Header */}
      <View className="bg-[#075E54] p-4 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2">
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>

        <Image
          source={{uri: receiverProfilePic}}
          className="w-10 h-10 rounded-full"
        />
        <View className="ml-3 flex-1">
          <Text className="text-white text-lg font-semibold">
            {receiverName}
          </Text>
          <Text className="text-white text-xs opacity-80">online</Text>
        </View>

        <TouchableOpacity className="ml-2">
          <Feather name="more-vertical" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      <ScrollView
        className="flex-1 px-2 pt-2"
        contentContainerStyle={{paddingBottom: 20}}>
        {renderMessages()}
      </ScrollView>

      {/* Message Input Area */}
      <View className="p-2 bg-[#F0F0F0] flex-row items-center">
        <View className="flex-1 flex-row items-center bg-white rounded-full px-4 py-1 mr-2">
          <Feather name="smile" size={24} color="#666" className="mr-2" />
          <TextInput
            className="flex-1 text-base mx-2"
            placeholder="Message"
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity className="mr-2">
            <Feather name="paperclip" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="camera" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => handleSend('text')}
          className="bg-[#075E54] rounded-full w-12 h-12 justify-center items-center">
          <Feather
            name={message.trim() ? 'send' : 'mic'}
            size={20}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default ChatScreen;
