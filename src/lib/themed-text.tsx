import React, {ReactNode, useContext} from 'react';
import {TextProps} from 'react-native';
import {Animated} from 'react-native';
import {ThemeContext} from '../services/theme-context';

interface Props extends Animated.AnimatedProps<TextProps> {
  children: ReactNode;
}

export function ThemedText({children, style, ...rest}: Props) {
  const {text} = useContext(ThemeContext);

  return (
    <Animated.Text style={[style, {color: text}]} {...rest}>
      {children}
    </Animated.Text>
  );
}
