import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface IContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: IContainerProps) => {
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
      {children}
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

export default Container;

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
