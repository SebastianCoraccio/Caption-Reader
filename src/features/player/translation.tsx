import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useRef} from 'react';
import {StyleSheet, Animated} from 'react-native';
import {LoadingEllipses} from '../../lib/loading-ellipses';
import {ThemedText} from '../../lib/themed-text';
import {ThemeContext} from '../../services/theme-context';
import {translate} from '../../services/translate';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 8,
    right: 0,
    top: 8,
    padding: 8,
    justifyContent: 'center',
  },
  textStyle: {
    fontFamily: 'Damascus',
    fontSize: 24,
  },
});

interface Props {
  sourceText: string;
  onCancel: () => void;
}

export function Translation({sourceText, onCancel}: Props) {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [translation, setTranslation] = useState<string | null>(null);

  const fetchTranslation = useCallback(async () => {
    const t = await translate(sourceText);
    setTranslation(t);
    setTimeout(() => {
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(onCancel);
    }, 2000);
  }, [sourceText, onCancel, opacityAnim]);

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    fetchTranslation();
  }, [fetchTranslation, opacityAnim]);

  const {background} = useContext(ThemeContext);

  return (
    <Animated.View
      style={[
        styles.container,
        {backgroundColor: background},
        {
          opacity: opacityAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
        },
      ]}>
      {translation ? (
        <ThemedText style={styles.textStyle} adjustsFontSizeToFit>
          {translation}
        </ThemedText>
      ) : (
        <LoadingEllipses />
      )}
    </Animated.View>
  );
}
