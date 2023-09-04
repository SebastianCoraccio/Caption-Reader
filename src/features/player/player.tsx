import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ScrollView, StyleSheet, useWindowDimensions, View} from 'react-native';
import Video from 'react-native-video';
import {S3_STORAGE_BASE_URL} from '../../../config';
import {FauxHeader} from '../../lib/faux-header';
import {ThemedView} from '../../lib/themed-view';
import {useCaptions} from '../../services/api';
import {addRecent} from '../../services/recents';
import {unslug} from '../../services/unslug';
import {useIsTablet} from '../../services/use-is-tablet';
import {Caption, CaptionSkeleton} from './caption';
import {ProgressBar} from './progress-bar';
import {Toolbar} from './toolbar';
import {VideoPlayer} from './video-player';

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 12,
  },
  skeleton: {
    paddingTop: 16,
    marginLeft: 8,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 20,
  },
  fullHeightContainer: {
    height: '100%',
  },
});

interface Props {
  title: string;
  folder: string;
}

export function Player({title, folder}: Props) {
  useEffect(
    function addVideoToRecents() {
      addRecent({title, folder, type: 'video'});
    },
    [title, folder],
  );
  const {height} = useWindowDimensions();

  const scrollRef = useRef<ScrollView>(null);
  const videoRef = useRef<Video>(null);
  const yPos = useRef<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [progress, setProgress] = useState(0);
  const isTablet = useIsTablet();
  const {captions} = useCaptions(title, folder);
  const handleTimeChange = useCallback(
    (currentTime: number, totalTime: number) => {
      if (!captions) return;
      captions.forEach((chunk, index) => {
        if (
          currentTime > chunk.timestamp &&
          (!captions[index + 1] || currentTime <= captions[index + 1].timestamp)
        ) {
          setCurrentIndex(index);
          setProgress((currentTime / totalTime) * 100);
          return;
        }
      });
    },
    [setCurrentIndex, captions],
  );

  useEffect(
    function scrollToActiveIndex() {
      if (scrollRef.current && yPos.current) {
        scrollRef.current.scrollTo({
          y: yPos.current[currentIndex],
          animated: true,
        });
      }
    },
    [currentIndex],
  );

  const handlePress = useCallback((_: number, timestamp: number) => {
    if (videoRef && videoRef.current) {
      videoRef.current.seek(timestamp + 0.1);
    }
  }, []);

  const handleRestart = useCallback(() => {
    if (videoRef && videoRef.current) {
      setCurrentIndex(0);
      videoRef.current.seek(0);
      setIsPaused(false);
    }
  }, []);

  const captionElements = useMemo(() => {
    if (!captions) {
      return null;
    }
    return captions.map((chunk, index) => {
      return (
        <View
          key={chunk.timestamp}
          onLayout={event => {
            yPos.current[index] = event.nativeEvent.layout.y;
          }}>
          <Caption
            isActive={currentIndex === index}
            lines={chunk.lines}
            timestamp={chunk.timestamp}
            index={index}
            onPress={handlePress}
          />
        </View>
      );
    });
  }, [captions, handlePress, currentIndex]);
  return (
    <ThemedView style={[styles.fullHeightContainer]}>
      {isTablet && <FauxHeader title={unslug(title)} />}
      <VideoPlayer
        url={`${S3_STORAGE_BASE_URL}${folder}${title}.mp4`}
        onProgress={handleTimeChange}
        ref={videoRef}
        paused={isPaused}
        onPress={() => setIsPaused(!isPaused)}
        onRestart={handleRestart}
      />
      <ProgressBar progress={progress} />
      <Toolbar />
      <View style={styles.fullHeightContainer}>
        {captionElements ? (
          <ScrollView style={styles.scrollContainer} ref={scrollRef}>
            {captionElements}
            <View style={{height}} />
          </ScrollView>
        ) : (
          <CaptionsSkeleton />
        )}
      </View>
    </ThemedView>
  );
}

function CaptionsSkeleton() {
  return (
    <View style={styles.skeleton}>
      <CaptionSkeleton width={240} />
      <CaptionSkeleton width={100} />
      <CaptionSkeleton width={240} />
      <CaptionSkeleton width={220} />
      <CaptionSkeleton width={100} />
      <CaptionSkeleton width={300} />
      <CaptionSkeleton width={100} />
      <CaptionSkeleton width={240} />
    </View>
  );
}
