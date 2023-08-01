import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Animated, GestureResponderEvent, StyleSheet, Text} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import {Line} from '../../services/api';
import {Colors, ThemeContext} from '../../services/theme-context';
import {usePulseAnimation} from '../../services/use-pulse-animation';
import {Furigana} from './furigana';
import {Translation} from './translation';

const styles = StyleSheet.create({
  clickView: {
    width: '100%',
    borderRadius: 8,
    padding: 12,
  },
  viewStyle: {
    backgroundColor: 'black',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  skeleton: {
    width: 240,
    margin: 12,
    borderRadius: 8,
  },
});

const themeStyles = {
  light: StyleSheet.create({container: {backgroundColor: Colors.black}}),
  dark: StyleSheet.create({container: {backgroundColor: Colors.white}}),
};

export function CaptionSkeleton({width}: {width: number}) {
  const pulse = usePulseAnimation();
  return (
    <Animated.View style={[styles.clickView, styles.skeleton, pulse, {width}]}>
      <Text>&nbsp;</Text>
    </Animated.View>
  );
}

interface Props {
  isActive: boolean;
  lines: Line[][];
  onPress: (index: number, timestamp: number) => void;
  timestamp: number;
  index: number;
}

export function Caption({isActive, lines, onPress, index, timestamp}: Props) {
  const activeAnim = useRef(new Animated.Value(0)).current;
  const pressedAnim = useRef(new Animated.Value(0)).current;
  const {
    themeStyle: {type},
  } = useContext(ThemeContext);
  const viewStyle = themeStyles[type].container;
  const touchStartY = useRef<number | null>();
  const holdTimer = useRef<number | null>();
  const [isPressed, setIsPressed] = useState(false);

  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(
    function setAnimatedValue() {
      Animated.timing(activeAnim, {
        toValue: isActive ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    },
    [isActive, activeAnim],
  );

  useEffect(
    function setAnimatedValue() {
      Animated.timing(pressedAnim, {
        toValue: isPressed ? 1 : 0,
        duration: 100,
        useNativeDriver: false,
      }).start();
    },
    [isPressed, pressedAnim],
  );

  const handleLongPress = useCallback(async () => {
    setIsPressed(false);
    ReactNativeHapticFeedback.trigger('impactLight');
    setIsTranslating(true);
    setTimeout(() => {
      setIsTranslating(false);
    }, 3000);
  }, [setIsTranslating]);

  return (
    <Fragment>
      <Animated.View
        style={[
          styles.clickView,
          {
            transform: [
              {
                scale: pressedAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.98],
                }),
              },
            ],
          },
        ]}
        onTouchStart={(event: GestureResponderEvent) => {
          touchStartY.current = event.nativeEvent.locationY;
          setIsPressed(true);
          holdTimer.current = setTimeout(
            handleLongPress,
            1000,
          ) as unknown as number;
        }}
        onTouchMove={(event: GestureResponderEvent) => {
          const dy =
            (touchStartY.current || event.nativeEvent.locationY) -
            event.nativeEvent.locationY;
          if (dy > 5 || dy < -5) setIsPressed(false);
        }}
        onTouchEnd={(_: GestureResponderEvent) => {
          if (holdTimer.current) clearTimeout(holdTimer.current);
          if (!isPressed) return;
          onPress(index, timestamp);
          touchStartY.current = null;
          setIsPressed(false);
        }}>
        <Animated.View
          style={[
            styles.viewStyle,
            viewStyle,
            styles.clickView,
            {
              opacity: pressedAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.1],
              }),
            },
          ]}
        />
        <Animated.View
          style={[
            {
              opacity: activeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.2, 1],
              }),
              transform: [
                {
                  scale: activeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                  }),
                },
                {
                  translateX: activeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-8, 0],
                  }),
                },
              ],
            },
          ]}>
          <Furigana lines={lines} showFurigana />
        </Animated.View>
      </Animated.View>
      {isTranslating && (
        <Translation
          sourceText={lines
            .map(line => line.map(word => word.text).join(''))
            .join('\n')}
          onCancel={() => setIsTranslating(false)}
        />
      )}
    </Fragment>
  );
}
