# Sparkle AI Chat ✨

[![npm version](https://badge.fury.io/js/react-native-sparkle-ai-chat.svg)](https://badge.fury.io/js/react-native-sparkle-ai-chat) ![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

▶️ [Intro](#intro) | [Example](#example) | [Downloads](#downloads) | [Installation](#installation) | [Usage](#usage) | [Features](#features) | [Props](#props) | [Advanced Configuration](#advanced-configuration) |

## Intro

Enhance your React Native applications with a powerful AI chat feature using Sparkle AI Chat library. This library integrates OpenAI's API and plans to extend support for Gemini AI APIs, making a wide range of models accessible for your applications.

## Example

<img src="screenshots/screen_record.gif" width="300" />

## Downloads

Install our app to check the features!

<p style="display: flex; gap: 20px">
    <a href="https://apps.apple.com/hr/app/sparkle-ai/id6450364523">
        <img src="screenshots/app_store.png" width="200px" alt="Ball Demo Screenshot"/>
    </a>
    <a href="https://play.google.com/store/apps/details?id=lk.codescale.sparkle">
        <img src="screenshots/google_play.png" width="200px" alt="Ball Demo Screenshot"/>
    </a>
</p>

## Installation

```bash
npm i react-native-sparkle-ai-chat @react-native-async-storage/async-storage
#or
yarn add react-native-sparkle-ai-chat @react-native-async-storage/async-storage
```

## Usage

Import SparkleChat into your React Native component and configure it with your desired AI platform and API key. Here's a quick example:

```typescript
import SparkleChat from 'react-native-sparkle-ai-chat';

<SparkleChat
    platform={'openai'}
    apiKey={'YOUR_API_KEY_HERE'}
    instruction={
        'Coffiaa AI Assistant is a virtual assistant that can help you with various coffees offered at Caffiaa Cafe. Ask me anything!'
    }
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
```

Replace `YOUR_API_KEY_HERE` with your actual OpenAI key.

See [`AIChatScreen.tsx`](https://github.com/lakpriya1s/react-native-sparkle-ai-chat/blob/main/example/src/screens/AIChatScreen.tsx)

## Features

- Easy integration with OpenAI and upcoming support for Gemini AI.
- Highly customizable chat interface to match your brand.
- Support for a wide range of AI models including GPT-4
- Extendable for future AI platforms.

## Props

### Required Properties

- **`platform`** (`'openai' | 'gemini'`): The AI chat platform to use for the conversation. Specifies whether to use OpenAI or Gemini as the chat service provider.
- **`apiKey`** (`string`): The API key for authenticating requests to the specified platform. This key is essential for the API's security and access control.

### Optional Properties

- **`apiBaseUrl`** (`string`): Overrides the default OpenAI API base URL. This is useful if you need to point to a custom endpoint or version of the OpenAI API.
- **`organization`** (`string`): The organization identifier for OpenAI calls, useful for associating API usage with a specific OpenAI organization account.
- **`maxModelTokens`** (`number`): Overrides the default maximum number of tokens allowed by the model's context, which defaults to 4096.
- **`maxResponseTokens`** (`number`): Overrides the default minimum number of tokens for the model's response, which defaults to 1000.
- **`completionParams`** (`object`): Customizes the completion request sent to the chat platform. It can include API parameters such as `temperature`, `presence_penalty`, etc., to adjust the assistant's personality and response behavior.
- **`instruction`** (`string`): The initial instruction or query sent to the chat platform, defining the conversation's context or starting point.
- **`brand`** (`object`): Customizes the appearance of the chat UI to align with your brand. This object can include:
  - **`name`** (`string`): The display name of the brand in the chat interface.
  - **`logo`** (`string`): The URL to the brand's logo image.
  - **`primaryColor`** (`string`): The primary color used throughout the chat UI.
  - **`inputContainerColor`** (`string`): The background color for the container where users input their messages.
  - **`headerColor`** (`string`): The background color of the chat header.
  - **`backgroundColor`** (`string`): The general background color of the chat interface.
  - **`textColor`** (`string`): The color of the text within the chat interface.
  - **`leftBubbleColor`** (`string`): The background color for messages received (left-aligned bubbles).
  - **`rightBubbleColor`** (`string`): The background color for messages sent (right-aligned bubbles).

These configuration options offer comprehensive control over the chat functionality and appearance, ensuring a seamless integration into your React Native application while maintaining brand consistency.

## Advanced Configuration

`react-native-sparkle-ai-chat` provides a flexible configuration system through the completionParams object, allowing you to finely tune the behavior of the platform (OpenAI). Below is an overview of these additional parameters and how they can be used to customize the chat experience.

### `completionParams` Overview

The completionParams object allows you to specify detailed behavior of the AI model, including model selection, response behavior, and content customization. Here's a breakdown of what each parameter can do:

- `model`: Select the AI model to use for generating responses. Currently supports gpt-4, gpt-3.5-turbo and gpt-3.5-turbo-0301. This choice affects the tone, style, and capabilities of the chat responses.

- `temperature`: Adjust the creativity of the responses. A higher temperature (e.g., 0.8) results in more varied and creative output, while a lower temperature (e.g., 0.2) produces more deterministic and focused responses.

- `top_p`: Implement nucleus sampling to limit the model's response choices to the top percentage of probability mass (e.g., top 10% for 0.1). It's an alternative to temperature for controlling randomness.

- `n`: Determine how many completion choices to generate for each input. This can be useful for offering multiple response options or enhancing the diversity of the conversation.

- `stream`: Enable streaming of partial message deltas, allowing for a more dynamic and interactive chat experience as responses are generated.

- `max_tokens`: Set the maximum length of the model's responses, which can help keep conversations concise or allow for more extended discussions.

- `presence_penalty` and `frequency_penalty`: Fine-tune the model's tendency to introduce new topics (presence_penalty) or repeat information (frequency_penalty).

- `logit_bias`: Apply biases to specific tokens during the model's generation process, influencing the likelihood of certain words or phrases appearing in the response.

- `user`: Provide a unique identifier for the end-user, assisting in monitoring and preventing abuse of the chat platform.

These parameters offer deep customization of the AI's behavior, allowing developers to tailor the chat experience to their specific requirements or the needs of their audience.

### Example with Advanced Configurations

```ts
import SparkleChat from 'react-native-sparkle-ai-chat';

<SparkleChat
  platform="openai"
  apiKey="YOUR_API_KEY"
  instruction="Your initial instruction or query here"
  completionParams={{
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    top_p: 0.9,
    n: 1,
    stream: false,
    max_tokens: 256,
    presence_penalty: 0.5,
    frequency_penalty: 0,
    logit_bias: { "50256": -100 }, // Example bias
    user: "unique_user_identifier"
  }}
  brand={{
    // Your branding configurations here
  }}
/>
```

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
