import React, {useContext, useState} from 'react';
import {ReactNode} from 'react';
import {GestureResponderEvent, Pressable, StyleSheet, Text} from 'react-native';
import {Colors, ThemeContext} from '../services/theme-context';
import {typography} from './styles';

const styles = StyleSheet.create({
  baseStyle: {
    height: 40,
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

interface Props {
  children: ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
}

export function Button({onPress, children, disabled}: Props) {
  const {themeStyle} = useContext(ThemeContext);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      disabled={disabled}
      hitSlop={10}
      style={[
        styles.baseStyle,
        {
          backgroundColor: disabled
            ? Colors.light
            : isPressed
            ? themeStyle.primaryLighter
            : themeStyle.primary,
        },
      ]}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}>
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
