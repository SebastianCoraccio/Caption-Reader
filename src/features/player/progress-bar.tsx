import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Colors} from '../../services/theme-context';

const BAR_HEIGHT = 6;

const styles = StyleSheet.create({
  bar: {
    height: BAR_HEIGHT,
    width: '100%',
    backgroundColor: Colors.dark,
  },
});

interface Props {
  progress: number;
}

export function ProgressBar({progress}: Props) {
  return (
    <View style={styles.bar}>
      <View
        style={[
          {backgroundColor: Colors.primary},
          {height: BAR_HEIGHT, width: `${progress}%`},
        ]}
      />
    </View>
  );
}
