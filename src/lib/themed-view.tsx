import React, {ReactNode, useContext} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {Animated, ViewProps} from 'react-native';
import {ThemeContext} from '../services/theme-context';

interface Props extends ViewProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ThemedView({children, style, ...rest}: Props) {
  const {background} = useContext(ThemeContext);

  return (
    <Animated.View style={[style, {backgroundColor: background}]} {...rest}>
      {children}
    </Animated.View>
  );
}
