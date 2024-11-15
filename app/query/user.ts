import {useMutation, useQuery} from '@tanstack/react-query';
import {
  actionFriendRequest,
  getAllFriends,
  getOtherUsers,
  getUserFriendRequests,
  loginUser,
  registerUser,
  sendFriendRequest,
} from '../services/user';
import {Alert} from 'react-native';
import {AppContext, queryClient, storage} from '../App';
import {useNavigation} from '@react-navigation/native';
import {useContext} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../screens/RootStackParams';
import {
  ActionFriendRequestResponse,
  FriendRequestBody,
  TMessage,
  User,
} from '../types/types';
import useChatStore from '../store/store';
import {jwtDecode} from 'jwt-decode';
import {CustomJwtPayload} from '../screens/FriendsScreen';
import {useApiQuery} from '../services/queryHelper';

type loginScreenProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      // Optionally handle success, e.g., redirect or show a message
      Alert.alert('Registration succcessful');
    },
    onError: error => {
      // Optionally handle error, e.g., show an error message
      console.error('Registration error:', error);
    },
  });
};

export const useLogin = () => {
  const navigation = useNavigation<loginScreenProp>();
  const {setIsSignedIn} = useContext(AppContext);
  const {setUserId} = useChatStore();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: data => {
      // Optionally handle success, e.g., redirect or show a message
      storage.set('userToken', data.token);
      setIsSignedIn(true);

      const decodeToken = jwtDecode<CustomJwtPayload>(data.token as string);
      setUserId(decodeToken.userId);
      Alert.alert('Login succcessful');
      navigation.navigate('Home');
    },
    onError: error => {
      // Optionally handle error, e.g., show an error message
      console.error('Login error:', error);
    },
  });
};

export const useGetOtherUsers = (userId: string) => {
  return useQuery<User[]>({
    queryKey: ['other-users', userId],
    queryFn: () => getOtherUsers(userId),
  });
};

export const useSendFriendRequest = () => {
  return useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      // Optionally handle success, e.g., redirect or show a message
      Alert.alert('Friend request sent successfully.');
    },
    onError: error => {
      // Optionally handle error, e.g., show an error message
      console.error('Error sending friend request:', error);
    },
  });
};

export const useGetUserFriendRequests = (userId: string) => {
  return useQuery<User[]>({
    queryKey: ['friend-requests', userId],
    queryFn: () => getUserFriendRequests(userId),
  });
};

export const useActionFriendRequest = () => {
  return useMutation<ActionFriendRequestResponse, Error, FriendRequestBody>({
    mutationFn: actionFriendRequest,
    onSuccess: data => {
      // Handle success, e.g., show a message
      Alert.alert(data.message);
      queryClient.invalidateQueries({queryKey: ['friend-requests']});
      queryClient.invalidateQueries({queryKey: ['other-users']});
    },
    onError: error => {
      // Handle error, e.g., show an error message
      console.error('Error sending friend request:', error);
      Alert.alert('Error', 'There was an issue processing your request.');
    },
  });
};

export const useGetAllUserFriends = (userId: string) => {
  return useQuery<User[]>({
    queryKey: ['all-friends', userId],
    queryFn: () => getAllFriends(userId),
    enabled: !!userId,
  });
};

export const useGetMessages = (userId: string, receiverId: string) => {
  const res = useApiQuery<TMessage[]>({
    url: `http://10.0.2.2:8000/messages/${userId}/${receiverId}`,
    queryKey: 'messages',
  });
  return res;
};

export const useGetUserData = (userId: string) => {
  const res = useApiQuery<User>({
    url: `http://10.0.2.2:8000/user/${userId}`,
    queryKey: 'user',
  });
  return res;
};
