import React from 'react';
import SparkleChat from 'react-native-sparkle-ai-chat';
import Container from '../components/Container';

interface AIChatScreenProps {
  navigation: any;
}

const AIChatScreen = ({ navigation }: AIChatScreenProps) => {
  return (
    <Container>
      <SparkleChat
        platform={'openai'}
        completionParams={{
          model: 'gpt-4',
          temperature: 0.8,
        }}
        apiKey={'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'}
        instruction={`Coffiaa AI Assistant is a virtual assistant, Coffiaa: The largest and the most preferred café chain in Sri Lanka, offering excellent Italian coffee and exceptional customer service for over 21 years.
          Innovative Technologies: Coffiaa has implemented the Mobile app, E-shop, Coffee Drive-thru, and store within stores to ensure a smooth and convenient experience for its customers.
          Loyalty Program: Coffiaa provides an exceptional loyalty program catered to coffee enthusiasts, offering fantastic perks including generous loyalty points, exclusive promotions, and special discounts.
          Latest News: Coffiaa celebrates its 31st outlet in Dehiwala, introduces the all-new 16-ounce tall cup, and collects over 2.7 million rupees for its annual “Share a Meal” campaign.`}
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
        onClose={navigation.goBack}
      />
    </Container>
  );
};

export default AIChatScreen;
