import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '..';
import type { IMessage } from '../../types';

export interface IChat {
  chats: IMessage[];
}

const initialState: IChat = {
  chats: [],
};
const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    addChat: (state, action) => {
      if (state.chats.find((item) => item._id == action.payload._id)) {
        state.chats = state.chats.map((item) =>
          item._id == action.payload._id ? action.payload : item
        );
      } else {
        state.chats.push(action.payload);
      }
    },
    resetChats: (state) => {
      state.chats = [];
    },
  },
});

export default chatsSlice;
export const { addChat, resetChats } = chatsSlice.actions;
export const chatsSelector = (state: RootState) => state.chats;
