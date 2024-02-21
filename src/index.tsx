import { Provider } from 'react-redux';
import ChatScreen from './ChatScreen';
import React from 'react';
import store from './store';

/**
 * Defines the properties required to configure the SparkleChat component.
 *
 * @interface IChatScreenProps
 */
export interface IChatScreenProps {
  /**
   * Specifies the chat platform to use, either 'openai' or 'gemini'.
   */
  platform: 'openai' | 'gemini';
  /**
   * The API key for authenticating requests to the specified platform.
   */
  apiKey: string;
  /**
   * Optional parameters to customize the completion request sent to the chat platform.
   */
  completionParams?: {
    /**
     * Controls randomness in the generation. Lower values make responses more deterministic.
     */
    temperature?: number;
    /**
     * The maximum number of tokens to generate in the completion.
     */
    max_tokens?: number;
    /**
     * Nucleus sampling parameter that controls the diversity of the generated responses.
     */
    top_p?: number;
    /**
     * Specifies the model to be used for generating responses.
     */
    model?: string;
  };
  /**
   * Instructions or queries to be sent to the chat platform.
   */
  instruction: string;
  /**
   * Optional branding configurations to customize the chat UI appearance.
   */
  brand?: {
    /**
     * The name of the brand to display in the chat interface.
     */
    name?: string;
    /**
     * URL to the brand's logo image.
     */
    logo?: string;
    /**
     * The primary color used in the chat UI, affecting buttons and other elements.
     */
    primaryColor?: string;
    /**
     * The background color for the input container where users type their messages.
     */
    inputContainerColor: string;
    /**
     * The background color for the chat header.
     */
    headerColor?: string;
    /**
     * The general background color for the chat interface.
     */
    backgroundColor?: string;
    /**
     * The color of the text across the chat interface.
     */
    textColor?: string;
    /**
     * The background color for messages received (left-aligned bubbles).
     */
    leftBubbleColor?: string;
    /**
     * The background color for messages sent (right-aligned bubbles).
     */
    rightBubbleColor?: string;
  };
}

const SparkleChat = (props: IChatScreenProps) => {
  return (
    <Provider store={store}>
      <ChatScreen {...props} />
    </Provider>
  );
};

export default SparkleChat;
