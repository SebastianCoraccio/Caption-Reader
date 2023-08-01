import {useWindowDimensions} from 'react-native';

export function useIsTablet() {
  const {height, width} = useWindowDimensions();
  const isTablet = Math.max(height, width) / Math.min(height, width) < 1.6;

  return isTablet;
}
