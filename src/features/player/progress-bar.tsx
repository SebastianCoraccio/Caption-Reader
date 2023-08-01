import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ThemedView} from '../../lib/themed-view';
import {Colors} from '../../services/theme-context';

const BAR_HEIGHT = 6;

const styles = StyleSheet.create({
  bar: {
    height: BAR_HEIGHT,
    width: '100%',
  },
});

interface Props {
  progress: number;
}

export function ProgressBar({progress}: Props) {
  return (
    <ThemedView style={styles.bar}>
      <View
        style={[
          {backgroundColor: Colors.primary},
          {height: BAR_HEIGHT, width: `${progress}%`},
        ]}
      />
    </ThemedView>
  );
}
