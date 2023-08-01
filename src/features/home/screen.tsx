import React, {useContext, useMemo} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {gutterNormal, typography} from '../../lib/styles';
import {ThemedText} from '../../lib/themed-text';
import {useManifest} from '../../services/api';
import {useRecents} from '../../services/recents';
import {ThemeContext} from '../../services/theme-context';
import {useIsTablet} from '../../services/use-is-tablet';
import {FolderList} from '../folder-list';
import {VideoCard} from '../video-list/video-card';
import {AppSettings} from './app-settings';

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: gutterNormal,
  },
  settingsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    // TODO remove magic number to get it to line up with file button
    marginRight: 4,
    width: 40,
    height: 40,
  },
  titleText: {
    paddingHorizontal: gutterNormal,
  },
  recentVideosContainer: {
    padding: gutterNormal,
  },
  recentRow: {
    flexDirection: 'row',
  },
  card: {
    marginBottom: gutterNormal,
    flex: 1,
  },
  imageStyle: {
    flex: 1,
    aspectRatio: 16 / 9,
  },
  spacer: {
    width: gutterNormal,
  },
  emptyStateContainer: {justifyContent: 'center', alignItems: 'center'},
});

export function HomeScreen() {
  const {data} = useManifest();

  const {background} = useContext(ThemeContext);

  const isTablet = useIsTablet();

  const recents = useRecents();

  const pairedRecents = useMemo(() => {
    if (!recents) return [];

    const paired = [];
    for (var i = 0; i < recents.length; i += 2) {
      paired.push([recents[i], recents[i + 1] || null]);
    }
    return paired;
  }, [recents]);

  const home = useMemo(
    () => (
      <Animated.ScrollView
        style={[{backgroundColor: background}, styles.container]}>
        <View style={styles.titleContainer}>
          <ThemedText
            style={[typography.title, styles.titleText]}
            adjustsFontSizeToFit
            numberOfLines={1}>
            Categories
          </ThemedText>
          <View style={styles.settingsContainer}>
            <AppSettings />
          </View>
        </View>

        <FolderList data={data} />
        <ThemedText style={[typography.title, styles.titleText]}>
          Recent
        </ThemedText>
        <View style={styles.recentVideosContainer}>
          {pairedRecents?.length ? (
            pairedRecents.map(recentPair => (
              <View
                style={styles.recentRow}
                key={`${recentPair[0].title}-${recentPair[1]?.title}`}>
                <VideoCard
                  style={styles.card}
                  folder={recentPair[0].folder}
                  title={recentPair[0].title}
                />
                <View style={styles.spacer} />
                {recentPair[1] ? (
                  <VideoCard
                    style={styles.card}
                    folder={recentPair[1].folder}
                    title={recentPair[1].title}
                  />
                ) : (
                  <View style={styles.card} />
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <ThemedText style={[typography.body]}>
                After you watch a video it will appear here
              </ThemedText>
            </View>
          )}
        </View>
      </Animated.ScrollView>
    ),
    [background, data, pairedRecents],
  );

  return isTablet ? (
    home
  ) : (
    <Animated.View style={{backgroundColor: background}}>
      <SafeAreaView>{home}</SafeAreaView>
    </Animated.View>
  );
}
