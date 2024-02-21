import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import SparkleChat from 'react-native-sparkle-ai-chat';

const Root = () => {
  const inset = useSafeAreaInsets();
  return (
    <>
      <StatusBar style="light" />
      <View
        style={[
          styles.topBar,
          {
            height: inset.top,
          },
        ]}
      />
      <SparkleChat
        platform={'openai'}
        apiKey={'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'}
        instruction={''}
        completionParams={{
          model: 'gpt-3.5-turbo',
        }}
        brand={{
          name: 'Coffiaa AI Assistant',
          logo: 'https://i.ibb.co/T2mwffj/friend.png',
          primaryColor: '#FF5C5C',
          inputContainerColor: '#161616',
          headerColor: '#161616',
          backgroundColor: '#000',
          textColor: '#fff',
          leftBubbleColor: '#1F1F1F',
          rightBubbleColor: '#FF5C5C',
        }}
      />
      <View
        style={[
          styles.bottomBar,
          {
            height: inset.bottom,
          },
        ]}
      />
    </>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <Root />
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161616',
    position: 'relative',
  },
  topBar: {
    backgroundColor: '#000',
  },
  bottomBar: {
    backgroundColor: '#161616',
  },
});
