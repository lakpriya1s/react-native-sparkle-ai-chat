import React, { useCallback, useRef, useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { ChatGPTAPI } from './util';
import { addChat, chatsSelector, resetChats } from './store/slices/chatsSlice';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { colors } from './theme/colors';
import TypingIndicator from './components/TypingIndicator';
import type { IMessage } from './types';

interface IChatScreenProps {
  platform: 'openai' | 'gemini';
  apiKey: string;
  apiBaseUrl?: string;
  organization?: string;
  maxModelTokens?: number;
  maxResponseTokens?: number;
  completionParams?: {
    model: string;
    temperature?: number | null;
    top_p?: number | null;
    n?: number | null;
    stream?: boolean | null;
    max_tokens?: number;
    presence_penalty?: number | null;
    frequency_penalty?: number | null;
    logit_bias?: object | null;
    user?: string;
  };
  instruction: string;
  brand?: {
    name?: string;
    logo?: string;
    primaryColor?: string;
    inputContainerColor: string;
    headerColor?: string;
    backgroundColor?: string;
    textColor?: string;
    leftBubbleColor?: string;
    rightBubbleColor?: string;
  };
}

function ChatScreen({
  platform,
  apiKey,
  apiBaseUrl,
  organization,
  maxModelTokens,
  maxResponseTokens,
  completionParams,
  instruction,
  brand = {
    name: 'Sparkle AI',
    primaryColor: '#FF5C5C',
    inputContainerColor: '#161616',
    headerColor: '#161616',
    backgroundColor: '#000',
    textColor: '#fff',
    leftBubbleColor: '#1F1F1F',
    rightBubbleColor: '#FF5C5C',
  },
}: IChatScreenProps): JSX.Element {
  const dispatch = useAppDispatch();
  const es = useRef<any>();
  const chats = useAppSelector(chatsSelector).chats;
  const [stop, setStop] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [result, setResult] = useState('');

  const addMessage = useCallback(
    (data: IMessage) => {
      dispatch(addChat(data));
    },
    [dispatch]
  );

  const handleGpt = useCallback(
    (message: string) => {
      setStop(true);
      let apiGpt35 = new ChatGPTAPI({
        apiKey,
        apiBaseUrl,
        organization,
        completionParams,
        maxModelTokens,
        maxResponseTokens,
      });

      const res = async () => {
        await apiGpt35.sendMessage(message, {
          systemMessage: instruction,
          onProgress: (partialResponse) => {
            addMessage({
              _id: partialResponse.id,
              text: partialResponse.text,
              createdAt: new Date(),
              user: {
                _id: 2,
                name: `{User${platform}}`,
              },
            });
          },
          onEvent: (event) => {
            setIsTyping(false);
            es.current = event;
          },
        });
        setStop(false);
      };
      res();
    },
    [
      addMessage,
      apiBaseUrl,
      apiKey,
      completionParams,
      instruction,
      maxModelTokens,
      maxResponseTokens,
      organization,
      platform,
    ]
  );

  const flatListRef = useRef(null);

  const onSend = useCallback(
    async (message: string) => {
      setResult('');
      setTimeout(() => {
        setResult('');
      }, 300);
      if (stop) {
        es.current?.removeAllEventListeners();
        es.current?.close();
        setStop(false);
        return;
      }
      if (message.trim() === '') {
        return;
      }
      setIsTyping(true);
      addMessage({
        _id: (chats.length + 1).toString(),
        text: message,
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'user',
        },
      });
      handleGpt(message);
    },
    [addMessage, chats.length, handleGpt, stop]
  );

  const Send = useCallback(() => {
    return (
      <>
        {!stop && (
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => onSend(result)}
          >
            <Text
              style={[
                styles.sendButtonText,
                {
                  color: brand.primaryColor,
                },
              ]}
            >{`➤`}</Text>
          </TouchableOpacity>
        )}
      </>
    );
  }, [brand.primaryColor, onSend, result, stop]);

  const Stop = useCallback(() => {
    return (
      <TouchableOpacity
        style={styles.sendButton}
        onPress={() => {
          setResult('');
          setStop(false);
          es.current?.removeAllEventListeners();
          es.current?.close();
        }}
      >
        <Text
          style={[
            styles.stopButtonText,
            {
              color: brand.primaryColor,
            },
          ]}
        >{`◻️`}</Text>
      </TouchableOpacity>
    );
  }, [brand.primaryColor]);

  const renderMessage = useCallback(
    ({ item, index }: { item: IMessage; index: number }) => {
      const isUser1 = item.user._id === 2;
      return (
        <View
          style={[
            styles.messageContainer,
            isUser1 ? styles.user1Container : styles.user2Container,
          ]}
        >
          <View
            style={[
              styles.messageBubble,
              isUser1
                ? [
                    styles.user1Bubble,
                    { backgroundColor: brand.leftBubbleColor },
                  ]
                : [
                    styles.user2Bubble,
                    {
                      backgroundColor: brand.rightBubbleColor,
                    },
                  ],
            ]}
          >
            <Text
              key={index}
              style={[
                styles.messageText,
                isUser1 ? styles.user1Text : styles.user2Text,
              ]}
            >
              {item.text}
            </Text>
          </View>
        </View>
      );
    },
    [brand.leftBubbleColor, brand.rightBubbleColor]
  );

  const MessageList = useCallback(() => {
    return (
      <FlatList
        ref={flatListRef}
        data={[...chats].reverse()}
        keyExtractor={(item) => item._id}
        renderItem={renderMessage}
        inverted
        contentContainerStyle={styles.chatContainer}
      />
    );
  }, [chats, renderMessage]);

  return (
    <>
      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.flexContainer}>
          <View
            style={[
              styles.topBarContent,
              { backgroundColor: brand.headerColor },
            ]}
          >
            <View style={styles.imageWrap}>
              {brand.logo && (
                <Image
                  style={styles.imageStyle}
                  source={{
                    uri: brand.logo,
                  }}
                />
              )}
            </View>
            <Text style={styles.name}>{brand.name}</Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                dispatch(resetChats());
              }}
            >
              <Text style={styles.resetButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.container,
              {
                backgroundColor: brand.backgroundColor,
              },
            ]}
          >
            <MessageList />
            <TypingIndicator
              isTyping={isTyping}
              backgroundColor={brand.leftBubbleColor}
              dotColor={brand.textColor}
            />
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: brand.inputContainerColor,
                },
              ]}
            >
              <TextInput
                style={[
                  styles.textInput,
                  { backgroundColor: brand.backgroundColor },
                ]}
                placeholder="Type a message..."
                value={result}
                multiline={true}
                placeholderTextColor={colors.grey}
                onChangeText={setResult}
              />
              <Send />
              {stop && <Stop />}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flex: 0,
  },
  flexContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  toastContainer: {
    height: 60,
    width: '80%',
    backgroundColor: colors.overlay,
    borderRadius: 8,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  toastText: {
    fontSize: 16,
    fontWeight: '400',
    color: 'white',
  },
  chatContainer: {
    flexGrow: 1,
    paddingHorizontal: 5,
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 5,
    marginTop: 5,
  },
  user1Container: {
    justifyContent: 'flex-start',
  },
  user2Container: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    borderRadius: 8,
    padding: 10,
  },
  user1Bubble: {
    backgroundColor: colors.left,
    marginLeft: 10,
    maxWidth: '80%',
  },
  user2Bubble: {
    backgroundColor: colors.right,
    marginRight: 10,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
  },
  user1Text: {
    color: 'white',
  },
  user2Text: {
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.secondary,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    borderWidth: 1,
    backgroundColor: colors.background,
    color: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginRight: 10,
    paddingTop: 10,
  },
  sendButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 4,
  },
  imageWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 100,
  },
  imageStyle: {
    width: 50,
    height: 50,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  topBarContent: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    height: 70,
    backgroundColor: colors.secondary,
  },
  svg: {
    padding: 10,
  },
  paperClip: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    fontSize: 30,
    height: 30,
    transform: [{ rotate: '-45deg' }],
  },
  stopButtonText: {
    height: 30,
    fontSize: 20,
  },
  resetButton: {
    position: 'absolute',
    right: 10,
    padding: 10,
  },
  resetButtonText: {
    fontSize: 30,
  },
});

export default ChatScreen;
