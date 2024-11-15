import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {MMKV} from 'react-native-mmkv';

// Initialize MMKV storage
const storage = new MMKV({id: 'chat-store'});

// Define the MMKV storage adapter
const mmkvStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: any) => {
    storage.set(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    storage.delete(name);
  },
};

type ViewType = 'messages' | 'friends' | 'profile';

interface StoreState {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  userId: string;
  setUserId: (id: string) => void;
}

const useChatStore = create<StoreState>()(
  persist(
    set => ({
      currentView: 'messages', // Default view
      setCurrentView: view => set({currentView: view}),
      userId: '', // Default userId
      setUserId: (id: string) => set({userId: id}),
    }),
    {
      name: 'chat-store', // Unique name for storage key
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);

export default useChatStore;
