import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button} from '../../lib/button';

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});

export function Toolbar() {
  return (
    <View style={styles.container}>
      <Button>Captions</Button>
      <Button>Furigana</Button>
      <Button>V Download</Button>
    </View>
  );
}
