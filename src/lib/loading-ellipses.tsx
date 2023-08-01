import React, {useContext, useEffect} from 'react';
import {useRef} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {ThemeContext} from '../services/theme-context';

const styles = StyleSheet.create({
  loadingContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loadingCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    margin: 4,
  },
});

export function LoadingEllipses() {
  const loadingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(loadingAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(loadingAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, [loadingAnim]);

  const {text} = useContext(ThemeContext);

  return (
    <View style={styles.loadingContainer}>
      <Animated.View
        style={[
          styles.loadingCircle,
          {backgroundColor: text},
          {
            opacity: loadingAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.3, 0.1, 0.1],
            }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.loadingCircle,
          {backgroundColor: text},
          {
            opacity: loadingAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.1, 0.3, 0.1],
            }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.loadingCircle,
          {backgroundColor: text},
          {
            opacity: loadingAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.1, 0.1, 0.3],
            }),
          },
        ]}
      />
    </View>
  );
}
