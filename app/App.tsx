import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useMemo} from 'react';
import Login from './screens/Login';
import '../global.css';
import Register from './screens/Register';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {MMKV} from 'react-native-mmkv';
import HomeScreen from './screens/HomeScreen';
import MessageScreen from './screens/MessageScreen';
import FriendsScreen from './screens/FriendsScreen';
import ChatScreen from './screens/ChatScreen';

export const storage = new MMKV();

const Stack = createNativeStackNavigator();
export const queryClient = new QueryClient();

// Define the context value type
interface AppContextType {
  isSignedIn: boolean;
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = React.createContext<AppContextType>({
  isSignedIn: false,
  setIsSignedIn: () => {},
});

const App = () => {
  const isToken = storage.contains('userToken');
  const [isSignedIn, setIsSignedIn] = React.useState(isToken);

  const appContextValue = useMemo(
    () => ({
      isSignedIn,
      setIsSignedIn,
    }),
    [isSignedIn],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={appContextValue}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={isSignedIn ? 'Home' : 'Login'}>
            {!isSignedIn ? (
              <>
                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="Register"
                  component={Register}
                  options={{headerShown: false}}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="Message"
                  component={MessageScreen}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="Friends"
                  component={FriendsScreen}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="Chat"
                  component={ChatScreen}
                  options={{headerShown: false}}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AppContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
