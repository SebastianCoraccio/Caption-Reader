import React, {useCallback, useContext} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Button} from '../../lib/button';
import {ClosedEyeIcon} from '../../lib/icons/closed-eye';
import {DownloadIcon} from '../../lib/icons/download';
import {HeartIcon} from '../../lib/icons/heart';
import {OpenEyeIcon} from '../../lib/icons/open-eye';
import {gutterCompact, gutterLarge, typography} from '../../lib/styles';
import {updateSetting} from '../../services/settings';
import {Colors, ThemeContext} from '../../services/theme-context';

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexShrink: 0,
  },
  contentContainer: {
    marginHorizontal: gutterCompact,
    marginRight: gutterLarge,
  },
  toggleButton: {
    flexDirection: 'row',
  },
  text: {
    color: Colors.white,
    paddingTop: 3,
  },
  button: {
    marginRight: gutterCompact,
    marginVertical: gutterCompact,
  },
  iconButton: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

interface Props {
  isHidingCaptions: boolean;
  onToggleCaptions: () => void;
  isHidingFurigana: boolean;
  onToggleFurigana: () => void;
}

export function Toolbar({
  onToggleCaptions,
  isHidingCaptions,
  onToggleFurigana,
  isHidingFurigana,
}: Props) {
  const {theme} = useContext(ThemeContext);

  const handleThemeChange = useCallback(() => {
    updateSetting({theme: theme === 'dark' ? 'light' : 'dark'});
  }, [theme]);

  return (
    <ScrollView
      style={styles.container}
      horizontal
      contentContainerStyle={styles.contentContainer}>
      <Button onPress={onToggleCaptions} style={styles.button}>
        <View style={styles.iconButton}>
          {isHidingCaptions ? (
            <ClosedEyeIcon color={Colors.white} />
          ) : (
            <OpenEyeIcon color={Colors.white} />
          )}
          <Text style={[typography.bodyBold, styles.text]}>&nbsp;Captions</Text>
        </View>
      </Button>
      <Button onPress={onToggleFurigana} style={styles.button}>
        <View style={styles.iconButton}>
          {isHidingFurigana ? (
            <ClosedEyeIcon color={Colors.white} />
          ) : (
            <OpenEyeIcon color={Colors.white} />
          )}
          <Text style={[typography.bodyBold, styles.text]}>&nbsp;Furigana</Text>
        </View>
      </Button>
      <Button onPress={handleThemeChange} style={styles.button}>
        <View style={styles.iconButton}>
          <HeartIcon color={'rgba(0,0,0,0)'} outline={Colors.white} />
          <Text style={[typography.bodyBold, styles.text]}>&nbsp;Like</Text>
        </View>
      </Button>
      <Button onPress={handleThemeChange} style={styles.button}>
        <View style={styles.iconButton}>
          <DownloadIcon color={Colors.white} />
          <Text style={[typography.bodyBold, styles.text]}>&nbsp;Download</Text>
        </View>
      </Button>
    </ScrollView>
  );
}
