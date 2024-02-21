import { Provider } from 'react-redux';
import ChatScreen from './ChatScreen';
import React from 'react';
import store from './store';

const SparkleChat = (props) => {
  return (
    <Provider store={store}>
      <ChatScreen {...props} />
    </Provider>
  );
};

export default SparkleChat;
