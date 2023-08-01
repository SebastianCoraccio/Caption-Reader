import {StyleSheet} from 'react-native';

export const gutterCompact = 8;
export const gutterNormal = 16;
export const gutterLarge = 24;

const baseStyle = {
  fontFamily: 'damascus',
};

export const typography = StyleSheet.create({
  title: {
    ...baseStyle,
    fontSize: 32,
    fontWeight: '700',
  },
  body: {
    ...baseStyle,
    fontSize: 16,
  },
  bodyBold: {
    ...baseStyle,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
