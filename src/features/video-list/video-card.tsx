import React from 'react';
import {TouchableOpacity, ViewStyle, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {S3_STORAGE_BASE_URL} from '../../../config';

import {useLayoutAwareNavigation} from '../../services/use-layout-aware-navigation';
const styles = StyleSheet.create({
  imageStyle: {
    flex: 1,
    aspectRatio: 16 / 9,
  },
});
interface Props {
  style: ViewStyle;
  folder: string;
  title: string;
}

export function VideoCard({style, folder, title}: Props) {
  const {navigateToPlayer} = useLayoutAwareNavigation();
  return (
    <TouchableOpacity
      style={style}
      activeOpacity={0.8}
      onPress={() =>
        navigateToPlayer({
          folder,
          title,
        })
      }>
      <FastImage
        source={{uri: `${S3_STORAGE_BASE_URL}${folder}${title}.jpg`}}
        style={styles.imageStyle}
      />
    </TouchableOpacity>
  );
}
