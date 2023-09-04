import React, {useContext} from 'react';
import {ReactNode} from 'react';
import {GestureResponderEvent, Pressable, StyleSheet, Text} from 'react-native';
import {Colors, ThemeContext} from '../services/theme-context';
import {typography} from './styles';

const styles = StyleSheet.create({
  baseStyle: {
    height: 40,
    padding: 8,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

interface Props {
  children: ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
}

export function Button({onPress, children}: Props) {
  const {themeStyle} = useContext(ThemeContext);

  return (
    <Pressable
      style={[
        styles.baseStyle,
        {
          backgroundColor: themeStyle.primary,
        },
      ]}
      onPress={onPress}>
      {typeof children === 'string' ? (
        <Text style={[typography.bodyBold, {color: Colors.white}]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
