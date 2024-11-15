// Login.js
import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import '../../global.css';
import {useLogin} from '../query/user';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from './RootStackParams';

type loginScreenProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const initialData = {
  email: '',
  password: '',
};

function Login() {
  const navigation = useNavigation<loginScreenProp>();
  const [formData, setFormData] = useState(initialData);
  const {mutateAsync: loginUser, isSuccess} = useLogin();

  async function handleLogin() {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    await loginUser(formData);

    setFormData(initialData);
  }

  return (
    <View className="flex-1 justify-center p-4 bg-white">
      <Text className="text-blue-700 text-3xl font-bold mb-2 text-center">
        Sign In
      </Text>
      <Text className="text-gray-600 mb-6 text-center">
        Sign in to your account
      </Text>

      <TextInput
        placeholder="Email"
        className="border border-gray-300 p-2 mb-4 rounded"
        keyboardType="email-address"
        onChangeText={text =>
          setFormData(prev => ({
            ...prev,
            email: text,
          }))
        }
      />
      <TextInput
        placeholder="Password"
        className="border border-gray-300 p-2 mb-4 rounded"
        secureTextEntry
        onChangeText={text =>
          setFormData(prev => ({
            ...prev,
            password: text,
          }))
        }
      />

      <TouchableOpacity
        className="bg-blue-700 p-3 rounded mb-4"
        onPress={handleLogin}>
        <Text className="text-white text-center">Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text className="text-center">Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Login;
