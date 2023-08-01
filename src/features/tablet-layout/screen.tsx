import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useContext} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {StackParamList} from '../../../navigation';
import {gutterNormal} from '../../lib/styles';
import {ThemedText} from '../../lib/themed-text';
import {ThemedView} from '../../lib/themed-view';
import {ThemeContext} from '../../services/theme-context';
import {HomeScreen} from '../home/screen';
import {PlayerScreen} from '../player/screen';
import {VideoListScreen} from '../video-list/screen';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
  },
  panel: {
    height: '100%',
    borderLeftWidth: StyleSheet.hairlineWidth,
    width: '25%',
  },
  homePanel: {
    paddingTop: gutterNormal,
    borderLeftWidth: 0,
  },
  videoPanel: {
    width: '50%',
  },
  emptyStateContainer: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontStyle: {
    fontFamily: 'Damascus',
    fontWeight: '500',
  },
});

export function AllScreen(
  props: NativeStackScreenProps<StackParamList, 'Player'>,
) {
  const {border} = useContext(ThemeContext);

  const emptyState = (text: string) => {
    return (
      <View style={styles.emptyStateContainer}>
        <ThemedText style={styles.fontStyle}>{text}</ThemedText>
      </View>
    );
  };

  return (
    <ThemedView style={[styles.container]}>
      <Animated.View
        style={[styles.panel, styles.homePanel, {borderColor: border}]}>
        <HomeScreen />
      </Animated.View>
      <Animated.View style={[styles.panel, {borderColor: border}]}>
        {props.route.params?.folder ? (
          <VideoListScreen
            {...(props as unknown as NativeStackScreenProps<
              StackParamList,
              'VideoList'
            >)}
          />
        ) : (
          emptyState('No folder selected')
        )}
      </Animated.View>
      <Animated.View
        style={[styles.panel, styles.videoPanel, {borderColor: border}]}>
        {props.route.params?.title ? (
          <PlayerScreen {...props} />
        ) : (
          emptyState('No video selected')
        )}
      </Animated.View>
    </ThemedView>
  );
}
