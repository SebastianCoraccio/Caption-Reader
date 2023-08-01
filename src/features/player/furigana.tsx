import React, {Fragment, useEffect, useMemo, useRef} from 'react';
import {Animated} from 'react-native';
import {StyleSheet, View} from 'react-native';

import {ThemedText} from '../../lib/themed-text';
import {Line} from '../../services/api';
import {useSettings} from '../../services/settings';
import {Colors} from '../../services/theme-context';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  focus: {
    borderColor: 'black',
  },
  furiganaFont: {
    fontSize: 14,
    height: 16,
    textAlign: 'center',
  },
  textFont: {
    fontSize: 30,
    textAlign: 'center',
  },
  lightModeText: {
    color: Colors.black,
  },
  darkModeText: {
    color: Colors.white,
  },
});

interface Props {
  lines: Line[][];
  showFurigana?: boolean;
}

export function Furigana({lines, showFurigana}: Props) {
  const {furiganaVisible} = useSettings();

  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: furiganaVisible ? 1 : 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [opacityAnim, furiganaVisible]);

  const furigana = useMemo(() => {
    return (
      <Fragment>
        {lines.map((line, lineIndex) => (
          <View style={styles.container} key={`line-${lineIndex}`}>
            {line.map((chunk, chunkIndex) => (
              <View
                style={styles.focus}
                key={`line-${lineIndex}-${chunkIndex}`}>
                {showFurigana &&
                  (line.some(i => Boolean(i.reading)) || chunk.reading) && (
                    <ThemedText
                      style={[styles.furiganaFont, {opacity: opacityAnim}]}>
                      {chunk.reading}
                    </ThemedText>
                  )}
                <View>
                  <ThemedText style={styles.textFont}>{chunk.text}</ThemedText>
                </View>
              </View>
            ))}
          </View>
        ))}
      </Fragment>
    );
  }, [lines, showFurigana, opacityAnim]);
  return furigana;
}
