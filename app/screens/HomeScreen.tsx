import React, {useContext} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AppContext, storage} from '../App';
import useChatStore from '../store/store';
import MessageScreen from './MessageScreen';
import FriendsScreen from './FriendsScreen';
import {cn} from '../types/types';

function HomeScreen() {
  const {setIsSignedIn} = useContext(AppContext);
  const {currentView, setCurrentView} = useChatStore();

  function handleLogout() {
    storage.delete('userToken');
    setIsSignedIn(false);
  }
  function renderViewScreen() {
    switch (currentView) {
      case 'messages':
        return <MessageScreen />;
      case 'friends':
        return <FriendsScreen />;
    }
  }

  /**
   * @todo image integration left and add friend logic
   */
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-center">Chat App</Text>
      <View className="flex-row justify-around mt-4">
        <TouchableOpacity onPress={() => setCurrentView('messages')}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setCurrentView('friends')}
          className={cn(
            'p-2 rounded-full', // Common styles
            currentView === 'friends' && 'bg-gray-200',
          )}>
          <Ionicons name="people-outline" size={24} color="gray" />
        </TouchableOpacity>
        <Ionicons name="person-outline" size={24} color="gray" />
      </View>
      {renderViewScreen()}
      <TouchableOpacity
        className="bg-blue-800 p-3 rounded mb-4 w-full"
        onPress={handleLogout}>
        <Text className="text-white text-center">LogOut</Text>
      </TouchableOpacity>
    </View>
  );
}

export default HomeScreen;
