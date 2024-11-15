import {FriendRequestBody} from '../types/types';

const url = 'https://chat-app-backend-production-5e5e.up.railway.app';
// Create a connection to the Socket.IO server

export const registerUser = async (userData: any) => {
  try {
    const response = await fetch(`${url}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      const errorData = await response.json(); // Get error response if available
      throw new Error(
        `Error ${response.status}: ${
          errorData.message || 'Registration failed'
        }`,
      );
    }

    const data = await response.json(); // Parse the response data
    return data; // Return the response data (e.g., user info, token)
  } catch (error) {
    console.error('Registration error:', error); // Log the error for debugging
    throw error; // Rethrow the error to be caught in the mutation's onError handler
  }
};

export const loginUser = async (userData: any) => {
  try {
    const response = await fetch(`${url}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      const errorData = await response.json(); // Get error response if available
      throw new Error(
        `Error ${response.status}: ${errorData.message || 'Login failed'}`,
      );
    }

    const data = await response.json(); // Parse the response data
    return data; // Return the response data (e.g., user info, token)
  } catch (error) {
    console.error('Login error:', error); // Log the error for debugging
    throw error; // Rethrow the error to be caught in the mutation's onError handler
  }
};

export const getOtherUsers = async (userId: string) => {
  try {
    const response = await fetch(`${url}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Include authorization header if needed
        // 'Authorization': `Bearer ${token}`,
      },
    });

    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      const errorData = await response.json(); // Get error response if available
      throw new Error(
        `Error ${response.status}: ${
          errorData.message || 'Fetching users failed'
        }`,
      );
    }

    const data = await response.json(); // Parse the response data
    return data; // Return the response data (e.g., list of other users)
  } catch (error) {
    console.error('Fetching other users error:', error); // Log the error for debugging
    throw error; // Rethrow the error to be caught in the calling function
  }
};

export const sendFriendRequest = async ({
  senderId,
  recipientId,
}: FriendRequestBody) => {
  try {
    const response = await fetch(`${url}/friend-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({senderId, recipientId}),
    });

    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error ${response.status}: ${
          errorData.message || 'Failed to send friend request'
        }`,
      );
    }

    const data = await response.json();
    return data; // Return the success message or any data returned from the server
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw error; // Rethrow the error to be caught by the calling code
  }
};

export const getUserFriendRequests = async (userId: string) => {
  try {
    const response = await fetch(`${url}/friend-requests/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Include authorization header if needed
        // 'Authorization': `Bearer ${token}`,
      },
    });

    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      const errorData = await response.json(); // Get error response if available
      throw new Error(
        `Error ${response.status}: ${
          errorData.message || 'Fetching requests failed'
        }`,
      );
    }

    const data = await response.json(); // Parse the response data
    return data; // Return the response data (e.g., list of other users)
  } catch (error) {
    console.error('Fetching friend requests error:', error); // Log the error for debugging
    throw error; // Rethrow the error to be caught in the calling function
  }
};

export const actionFriendRequest = async ({
  senderId,
  recipientId,
  action,
}: FriendRequestBody) => {
  try {
    const response = await fetch(`${url}/friend-request/${senderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({recipientId, action}),
    });

    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error ${response.status}: ${
          errorData.message || 'Failed to send friend request'
        }`,
      );
    }

    const data = await response.json();
    return data; // Return the success message or any data returned from the server
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw error; // Rethrow the error to be caught by the calling code
  }
};

export const getAllFriends = async (userId: string) => {
  try {
    const response = await fetch(`${url}/friends/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Include authorization header if needed
        // 'Authorization': `Bearer ${token}`,
      },
    });

    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      const errorData = await response.json(); // Get error response if available
      throw new Error(
        `Error ${response.status}: ${
          errorData.message || 'Fetching requests failed'
        }`,
      );
    }

    const data = await response.json(); // Parse the response data
    return data; // Return the response data (e.g., list of other users)
  } catch (error) {
    console.error('Fetching friends error:', error); // Log the error for debugging
    throw error; // Rethrow the error to be caught in the calling function
  }
};

// // Function to send messages using Socket.IO
// export const sendMessages = async body => {
//   try {
//     const {senderId, recipientId, message, messageType, imageUrl} = body;

//     socket.on('connect', () => {
//       console.log('Connected to server with socket id:', socketInstance.id);
//       socket.emit('registerSocket', userId); // Register this socket with the server
//     });

//     console.log(body);
//     // Emit the message to the server
//     socket.emit('sendMessage', {
//       senderId,
//       recipientId,
//       message,
//       messageType,
//       imageUrl: imageUrl || null,
//     });

//     // Return a success message immediately
//     return {message: 'Message sent successfully'};
//   } catch (error) {
//     console.error('Error sending message via Socket.IO:', error);
//     throw error; // Rethrow the error to be caught by the calling code
//   }
// };
