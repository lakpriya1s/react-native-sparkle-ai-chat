import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Container from '../components/Container';

interface IHomeProps {
  navigation: any;
}

const Home = ({ navigation }: IHomeProps) => {
  return (
    <Container>
      <View style={styles.container}>
        <Text style={styles.text}>
          Click the button below to start chatting!
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AIChatScreen');
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>💬</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
    color: '#fff',
  },
  button: {
    marginTop: 20,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 30,
    backgroundColor: '#FF5C5C',
  },
  buttonText: {
    fontSize: 30,
  },
});

export default Home;
