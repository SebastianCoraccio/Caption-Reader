import React, {Fragment, useContext} from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {gutterCompact, gutterNormal, typography} from '../../lib/styles';
import {ThemedText} from '../../lib/themed-text';
import {FileMetaData} from '../../services/api';
import {ThemeContext} from '../../services/theme-context';
import {unslug} from '../../services/unslug';
import {useLayoutAwareNavigation} from '../../services/use-layout-aware-navigation';
import {usePulseAnimation} from '../../services/use-pulse-animation';

const styles = StyleSheet.create({
  listContainer: {
    paddingLeft: gutterNormal,
    paddingBottom: gutterNormal,
  },
  skeletonListItem: {
    width: 240,
    backgroundColor: 'black',
    borderRadius: 4,
  },
  listItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'white',
    paddingVertical: gutterCompact,
  },
  listButton: {
    height: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: gutterNormal,
    alignItems: 'center',
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderBottomWidth: 6,
    borderTopWidth: 6,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    borderLeftColor: 'white',
    paddingRight: 2,
  },
});

function FolderListSkeleton({
  style,
}: {
  style: Animated.AnimatedProps<ViewStyle>;
}) {
  const pulseAnimation = usePulseAnimation();

  const folderTitleSkeleton = (
    <Animated.View style={[styles.listItem, style]}>
      <Animated.View style={[pulseAnimation, styles.skeletonListItem]}>
        <Text style={typography.body}>&nbsp;</Text>
      </Animated.View>
    </Animated.View>
  );

  return (
    <Fragment>
      {folderTitleSkeleton}
      {folderTitleSkeleton}
    </Fragment>
  );
}

interface Props {
  data: FileMetaData[] | null;
}

export function FolderList({data}: Props) {
  const {navigateToFolder} = useLayoutAwareNavigation();

  const {text, border} = useContext(ThemeContext);
  return (
    <View style={styles.listContainer}>
      {data ? (
        data.map(folder => (
          <Animated.View
            key={folder.title}
            style={[styles.listItem, {borderColor: border}]}>
            <TouchableOpacity
              onPress={() => navigateToFolder({folder: folder.title})}
              style={styles.listButton}>
              <ThemedText style={typography.body} numberOfLines={2}>
                {unslug(folder.title)}
              </ThemedText>
              <Animated.View
                style={[styles.triangle, {borderLeftColor: text}]}
              />
            </TouchableOpacity>
          </Animated.View>
        ))
      ) : (
        <FolderListSkeleton style={{borderColor: border}} />
      )}
    </View>
  );
}
