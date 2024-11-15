import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useRegister} from '../query/user';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from './RootStackParams';

const initialData = {
  name: '',
  email: '',
  password: '',
};

type registerScreenProp = NativeStackNavigationProp<
  RootStackParamList,
  'Register'
>;

function Register() {
  const navigation = useNavigation<registerScreenProp>();
  const [formData, setFormData] = useState(initialData);

  const {mutateAsync: registerUser} = useRegister();

  /**
   * @todo
   */
  async function requestCameraPermission() {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'App Camera Permission',
        message: 'App needs access to your camera',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  async function handleImageUpload() {
    // Ask user to choose between Camera and Gallery
    Alert.alert('Select Image Source', 'Choose your image source', [
      {
        text: 'Camera',
        onPress: async () => {
          const permissionGranted = await requestCameraPermission();
          if (permissionGranted) {
            const result = await launchCamera({
              mediaType: 'photo',
              quality: 1,
            });
            if (result.assets) {
              console.log('Camera Image:', result.assets);
            } else {
              console.log('Camera Image selection was canceled or failed.');
            }
          } else {
            console.log('Camera permission denied');
          }
        },
      },
      {
        text: 'Gallery',
        onPress: async () => {
          const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 1,
            includeBase64: false,
          });
          if (result.assets) {
            console.log('Gallery Image:', result.assets);
          } else {
            console.log('Gallery Image selection was canceled or failed.');
          }
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  }

  async function handleRegister() {
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    await registerUser(formData);
    setFormData(initialData);
  }

  return (
    <View className="flex-1 items-center justify-center p-4 bg-white">
      <Text className="text-blue-700 text-3xl font-bold mb-2">Register</Text>
      <Text className="text-gray-600 mb-6 text-center">
        Create a new account
      </Text>

      <TextInput
        placeholder="Name"
        className="border border-gray-300 p-2 mb-4 rounded w-full"
        onChangeText={text => setFormData(prev => ({...prev, name: text}))}
      />
      <TextInput
        placeholder="Email"
        className="border border-gray-300 p-2 mb-4 rounded w-full"
        keyboardType="email-address"
        onChangeText={text => setFormData(prev => ({...prev, email: text}))}
      />
      <TextInput
        placeholder="Password"
        className="border border-gray-300 p-2 mb-4 rounded w-full"
        secureTextEntry
        onChangeText={text => setFormData(prev => ({...prev, password: text}))}
      />

      <TouchableOpacity
        onPress={handleImageUpload}
        className="border border-gray-300 p-2 mb-4 rounded w-full items-center">
        <Text className="text-gray-600">Upload Image</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-blue-800 p-3 rounded mb-4 w-full"
        onPress={handleRegister}>
        <Text className="text-white text-center">Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text className="text-darkBlue text-center">
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default Register;
