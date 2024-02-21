import * as React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { TypingAnimation } from 'react-native-typing-animation';
import { colors } from '../theme/colors';
const TypingIndicator = ({
  isTyping,
  backgroundColor = colors.left,
  dotColor = colors.white,
}: {
  isTyping: boolean;
  backgroundColor?: string;
  dotColor?: string;
}) => {
  const { yCoords, heightScale, marginScale } = React.useMemo(
    () => ({
      yCoords: new Animated.Value(100),
      heightScale: new Animated.Value(0),
      marginScale: new Animated.Value(0),
    }),
    []
  );

  React.useEffect(() => {
    if (isTyping) {
      slideIn();
    } else {
      slideOut();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTyping]);

  const slideIn = () => {
    Animated.parallel([
      Animated.spring(yCoords, {
        toValue: 0,
        useNativeDriver: false,
      }),
      Animated.timing(heightScale, {
        toValue: 35,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(marginScale, {
        toValue: 8,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const slideOut = () => {
    Animated.parallel([
      Animated.spring(yCoords, {
        toValue: 200,
        useNativeDriver: false,
      }),
      Animated.timing(heightScale, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(marginScale, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            {
              translateY: yCoords,
            },
          ],
          height: heightScale,
          marginBottom: marginScale,
          backgroundColor: backgroundColor,
        },
      ]}
    >
      {isTyping ? (
        <TypingAnimation
          style={styles.type}
          dotRadius={4}
          dotMargin={5.5}
          dotColor={dotColor}
        />
      ) : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 15,
    width: 45,
    borderRadius: 10,
    backgroundColor: colors.left,
  },
  type: { marginLeft: 6, marginTop: 7.2 },
});

export default TypingIndicator;
