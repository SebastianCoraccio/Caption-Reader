import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Video from 'react-native-video';

var styles = StyleSheet.create({
  video: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: 'black',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  activeOverlay: {
    backgroundColor: 'black',
    opacity: 0.2,
  },
  playContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 128,
    height: 128,
    backgroundColor: 'black',
    opacity: 0.8,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 40,
    borderBottomWidth: 24,
    borderTopWidth: 24,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    borderLeftColor: 'white',
    marginLeft: 8,
  },
  leftTriangle: {
    width: 0,
    height: 0,
    borderRightWidth: 40,
    borderBottomWidth: 24,
    borderTopWidth: 24,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    borderRightColor: 'white',
  },
  tallRectangle: {
    width: 8,
    height: 48,
    backgroundColor: 'white',
  },
  flexRow: {
    flexDirection: 'row',
  },
});

interface Props {
  url: string;
  onProgress: (time: number, total: number) => void;
  onRestart: () => void;
  onPress: () => void;
  paused: boolean;
}

export const VideoPlayer = React.forwardRef<Video, Props>(
  ({url, onProgress, paused, onPress, onRestart}, ref) => {
    const [showRestart, setShowRestart] = useState(false);

    return (
      <View>
        <Video
          source={{
            uri: url,
          }}
          ref={ref}
          style={styles.video}
          progressUpdateInterval={250}
          onProgress={({currentTime, playableDuration}) => {
            // If the user seeks to a position before playing the video
            // it will incorrectly report playableDuration as 0
            //
            // '-1' for 1 second before the end of the video
            setShowRestart(
              playableDuration !== 0 && currentTime > playableDuration - 1,
            );
            onProgress(currentTime, playableDuration);
          }}
          paused={paused}
          ignoreSilentSwitch="ignore"
          onEnd={onPress}
        />
        {paused && (
          <View style={styles.playContainer}>
            <View style={styles.playButton}>
              {showRestart ? (
                <View style={styles.flexRow}>
                  <View style={styles.tallRectangle} />
                  <View style={styles.leftTriangle} />
                </View>
              ) : (
                <View style={styles.rightTriangle} />
              )}
            </View>
          </View>
        )}
        <Pressable
          onPress={paused && showRestart ? onRestart : onPress}
          style={[styles.overlay, paused ? styles.activeOverlay : {}]}
        />
      </View>
    );
  },
);
