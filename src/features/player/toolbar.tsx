import React, {useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button} from '../../lib/button';
import {ClosedEyeIcon} from '../../lib/icons/closed-eye';
import {DownloadIcon} from '../../lib/icons/download';
import {OpenEyeIcon} from '../../lib/icons/open-eye';
import {typography} from '../../lib/styles';
import {useSettings, updateSetting} from '../../services/settings';
import {Colors} from '../../services/theme-context';

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleButton: {
    flexDirection: 'row',
  },
  text: {
    color: Colors.white,
    paddingTop: 3,
  },
  iconButton: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface Props {
  isHidingCaptions: boolean;
  onToggleCaptions: () => void;
}

export function Toolbar({onToggleCaptions, isHidingCaptions}: Props) {
  const {furiganaVisible} = useSettings();

  const handleToggle = useCallback(() => {
    updateSetting({furiganaVisible: !furiganaVisible});
  }, [furiganaVisible]);

  return (
    <View style={styles.container}>
      <Button onPress={onToggleCaptions}>
        <View style={styles.iconButton}>
          {isHidingCaptions ? (
            <ClosedEyeIcon color={Colors.white} />
          ) : (
            <OpenEyeIcon color={Colors.white} />
          )}
          <Text style={[typography.bodyBold, styles.text]}>&nbsp;Captions</Text>
        </View>
      </Button>
      <Button onPress={handleToggle}>
        <View style={styles.iconButton}>
          {furiganaVisible ? (
            <OpenEyeIcon color={Colors.white} />
          ) : (
            <ClosedEyeIcon color={Colors.white} />
          )}
          <Text style={[typography.bodyBold, styles.text]}>&nbsp;Furigana</Text>
        </View>
      </Button>
      <Button onPress={handleToggle} disabled>
        <View style={styles.iconButton}>
          <DownloadIcon color={Colors.white} />
          <Text style={[typography.bodyBold, styles.text]}>&nbsp;Download</Text>
        </View>
      </Button>
    </View>
  );
}
