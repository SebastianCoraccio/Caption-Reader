import {useContext, useEffect, useRef} from 'react';
import {Animated, StyleSheet} from 'react-native';
import {Colors, ThemeContext} from './theme-context';

const themeStyles = {
  light: StyleSheet.create({container: {backgroundColor: Colors.black}}),
  dark: StyleSheet.create({container: {backgroundColor: Colors.white}}),
};

export function usePulseAnimation() {
  const {
    themeStyle: {type},
  } = useContext(ThemeContext);
  const backgroundStyle = themeStyles[type].container;

  const opacityAnim = useRef(new Animated.Value(0)).current;
  useEffect(
    function setAnimatedValue() {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    },
    [opacityAnim],
  );

  return {
    ...backgroundStyle,
    opacity: opacityAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.2, 0.3],
    }),
  };
}
