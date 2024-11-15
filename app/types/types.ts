export interface FriendRequestBody {
  senderId: string;
  recipientId: string;
  action?: string;
}

export const cn = (...classes: any[]) => {
  return classes.filter(Boolean).join(' ');
};

export interface User {
  _id: string;
  name: string;
  email: string;
  friendRequests: string[];
  friends: string[]; // Array of user IDs representing friends
  sentFriendRequests: string[]; // Array of user IDs who you sent friend requests
  // createdAt: Date; // Date of creation
  // updatedAt: Date; // Date of last update
}

export interface ActionFriendRequestResponse {
  message: string;
}

export interface TMessage {
  senderId: string;
  recipientId: string;
  messageType: string;
  message?: string;
  image?: {
    uri: string;
    name: string;
    type?: string;
  };
  timestamp: string;
  _id: string;
}
