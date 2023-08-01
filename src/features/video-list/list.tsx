import React, {Fragment, useContext} from 'react';
import {Animated, StyleSheet} from 'react-native';
import {FauxHeader} from '../../lib/faux-header';
import {gutterNormal} from '../../lib/styles';
import {FileMetaData} from '../../services/api';
import {ThemeContext} from '../../services/theme-context';
import {unslug} from '../../services/unslug';
import {useIsTablet} from '../../services/use-is-tablet';
import {usePulseAnimation} from '../../services/use-pulse-animation';
import {VideoCard} from './video-card';

const styles = StyleSheet.create({
  card: {
    marginBottom: gutterNormal,
    width: '100%',
    aspectRatio: 16 / 9,
  },
  listContainer: {
    padding: gutterNormal,
  },
});

interface Props {
  data: FileMetaData[] | null;
  folder: string;
}

export function VideoList({data, folder}: Props) {
  const pulseAnimation = usePulseAnimation();
  const isTablet = useIsTablet();

  const {background} = useContext(ThemeContext);

  const videos = data !== null ? data : new Array(5).fill({title: null});
  return (
    <Fragment>
      {isTablet && <FauxHeader title={unslug(folder)} />}
      <Animated.FlatList
        style={{backgroundColor: background}}
        contentContainerStyle={styles.listContainer}
        data={videos}
        scrollEnabled={Boolean(data)}
        renderItem={({item, index}) => {
          if (!item.title)
            return (
              <Animated.View
                key={`card-${index}`}
                style={[pulseAnimation, styles.card]}
              />
            );

          return (
            <VideoCard style={styles.card} folder={folder} title={item.title} />
          );
        }}
      />
    </Fragment>
  );
}
