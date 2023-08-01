import React, {useContext} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ThemeContext} from '../services/theme-context';
import {gutterCompact, typography} from './styles';
import {ThemedText} from './themed-text';

const styles = StyleSheet.create({
  header: {
    height: 32,
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: gutterCompact,
  },
});

interface Props {
  title: string;
  headerRight?: () => React.ReactNode;
}

export function FauxHeader({title, headerRight}: Props) {
  const {top} = useSafeAreaInsets();
  const {border, background} = useContext(ThemeContext);

  return (
    <Animated.View
      style={[
        styles.header,
        {backgroundColor: background, borderColor: border},
        {marginTop: top},
      ]}>
      <View />
      <ThemedText style={[typography.body]}>{title}</ThemedText>
      <View>{headerRight ? headerRight() : null}</View>
    </Animated.View>
  );
}
