import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {updateSetting, useSettings} from '../services/settings';
import {ThemedText} from './themed-text';
const styles = StyleSheet.create({
  toggleButton: {
    flexDirection: 'row',
  },
});

export function FuriganaToggle() {
  const {furiganaVisible} = useSettings();

  const handleToggle = useCallback(() => {
    updateSetting({furiganaVisible: !furiganaVisible});
  }, [furiganaVisible]);

  return (
    <TouchableOpacity onPress={handleToggle} style={styles.toggleButton}>
      <ThemedText>{furiganaVisible ? '👀' : '🙈'}&nbsp;Furi</ThemedText>
    </TouchableOpacity>
  );
}
