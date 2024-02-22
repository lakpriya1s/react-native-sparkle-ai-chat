import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const getScaledNumber = (size: number = 0) => {
  const scale = SCREEN_WIDTH / 375;
  const newSize = size * scale;
  const nearestPixel = PixelRatio.roundToNearestPixel(newSize);

  if (Platform.OS === 'ios') return Math.round(nearestPixel);

  return Math.round(nearestPixel) - 2;
};
