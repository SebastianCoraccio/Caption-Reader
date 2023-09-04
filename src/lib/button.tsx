import React, {useContext} from 'react';
import {ReactNode} from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {Colors, ThemeContext} from '../services/theme-context';
import {typography} from './styles';

const styles = StyleSheet.create({
  baseStyle: {
    height: 40,
    padding: 8,
    borderRadius: 4,
    justifyContent: 'center',
  },
});

interface Props {
  children: ReactNode;
}

export function Button({children}: Props) {
  const {themeStyle} = useContext(ThemeContext);
  console.log(typeof children);
  return (
    <Pressable
      style={[
        styles.baseStyle,
        {
          backgroundColor: themeStyle.primary,
        },
      ]}>
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
