import React, {Fragment, useMemo} from 'react';
import {Animated} from 'react-native';
import {StyleSheet, View} from 'react-native';

import {Line} from '../../services/api';
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
  furiganaOpacityAnimation: Animated.Value;
  textColorAnimation: Animated.AnimatedInterpolation<string | number>;
}

export function Furigana({
  lines,
  furiganaOpacityAnimation,
  textColorAnimation,
}: Props) {
  const furigana = useMemo(() => {
    return (
      <Fragment>
        {lines.map((line, lineIndex) => (
          <View style={styles.container} key={`line-${lineIndex}`}>
            {line.map((chunk, chunkIndex) => (
              <View
                style={styles.focus}
                key={`line-${lineIndex}-${chunkIndex}`}>
                {(line.some(i => Boolean(i.reading)) || chunk.reading) && (
                  <Animated.Text
                    style={[
                      styles.furiganaFont,
                      {
                        opacity: furiganaOpacityAnimation,
                        color: textColorAnimation,
                      },
                    ]}>
                    {chunk.reading}
                  </Animated.Text>
                )}
                <View>
                  <Animated.Text
                    style={[
                      styles.textFont,
                      {
                        color: textColorAnimation,
                      },
                    ]}>
                    {chunk.text}
                  </Animated.Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </Fragment>
    );
  }, [lines, furiganaOpacityAnimation, textColorAnimation]);
  return furigana;
}
