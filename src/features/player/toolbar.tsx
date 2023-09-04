import React, {useCallback} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Button} from '../../lib/button';
import {typography} from '../../lib/styles';
import {ThemedText} from '../../lib/themed-text';
import {useSettings, updateSetting} from '../../services/settings';
import {Colors} from '../../services/theme-context';

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  toggleButton: {
    flexDirection: 'row',
  },
  text: {
    color: Colors.white,
  },
});

export function Toolbar() {
  const {furiganaVisible} = useSettings();

  const handleToggle = useCallback(() => {
    updateSetting({furiganaVisible: !furiganaVisible});
  }, [furiganaVisible]);

  return (
    <View style={styles.container}>
      <Button>Captions</Button>
      <Button onPress={handleToggle}>
        <Text style={[typography.bodyBold, styles.text]}>
          {furiganaVisible ? '👀' : '🙈'}&nbsp;Furi
        </Text>
      </Button>
      <Button>V Download</Button>
    </View>
  );
}
