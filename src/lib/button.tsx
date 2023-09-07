import React, {useContext} from 'react';
import {ReactNode} from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
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
  style?: StyleProp<ViewStyle>;
}

export function Button({onPress, children, disabled, style}: Props) {
  const {themeStyle} = useContext(ThemeContext);

  return (
    <TouchableOpacity
      disabled={disabled}
      hitSlop={10}
      style={[
        styles.baseStyle,
        {
          backgroundColor: disabled ? Colors.light : themeStyle.primary,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}>
      {typeof children === 'string' ? (
        <Text style={[typography.bodyBold, {color: Colors.white}]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
