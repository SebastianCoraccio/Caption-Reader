import React, {
  ReactNode,
  createContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import {Animated, StatusBar, useColorScheme} from 'react-native';
import {addListener, removeListener} from './async-storage';
import {Settings, useSettings} from './settings';

type ThemeType = 'light' | 'dark';

interface Theme {
  type: ThemeType;
  background: string;
  card: string;
  text: string;
  border: string;
  primary: string;
}
interface ThemeAnimated {
  theme: 'light' | 'dark' | 'system';
  themeStyle: Theme;
  background: Animated.AnimatedInterpolation<string | number>;
  card: Animated.AnimatedInterpolation<string | number>;
  text: Animated.AnimatedInterpolation<string | number>;
  border: Animated.AnimatedInterpolation<string | number>;
  primary: Animated.AnimatedInterpolation<string | number>;
}

export const Colors = {
  primary: '#1292B4',
  white: '#FFF',
  lighter: '#F3F3F3',
  light: '#DAE1E7',
  dark: '#444',
  darker: '#222',
  black: '#000',
};

const lightTheme: Theme = {
  type: 'light',
  background: Colors.lighter,
  card: Colors.lighter,
  text: Colors.black,
  border: Colors.dark,
  primary: Colors.primary,
};
const darkTheme: Theme = {
  type: 'dark',
  background: Colors.black,
  card: '#23272b',
  text: Colors.white,
  border: Colors.light,
  primary: Colors.primary,
};

const defaultTheme: ThemeAnimated = {
  theme: 'light',
  type: 'light',
  background: new Animated.Value(0),
  card: new Animated.Value(0),
  text: new Animated.Value(0),
  border: new Animated.Value(0),
  primary: new Animated.Value(0),
};

export const ThemeContext = createContext<ThemeAnimated>(defaultTheme);

export function ThemeContextProvider({children}: {children: ReactNode}) {
  const systemTheme = useColorScheme();

  const {theme} = useSettings();
  const currentTheme = theme === 'system' ? systemTheme || 'light' : theme;

  const [type, setType] = useState<ThemeType>('light');

  // 0 is light, 1 is dark
  const themeAnimation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(themeAnimation, {
      toValue: type === 'light' ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [themeAnimation, type]);

  useEffect(() => {
    async function setInitialRecents() {
      const t = theme === 'system' ? systemTheme || 'light' : theme;
      setType(t);
    }
    setInitialRecents();

    function handleSettingsChange({theme: updatedTheme}: Settings) {
      setType(
        updatedTheme === 'system' ? systemTheme || 'light' : updatedTheme,
      );
    }

    addListener('settings', handleSettingsChange);

    return () => {
      removeListener('settings', handleSettingsChange);
    };
  }, [systemTheme, theme]);

  const background = themeAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [lightTheme.background, darkTheme.background],
  });
  const card = themeAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [lightTheme.card, darkTheme.card],
  });
  const text = themeAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [lightTheme.text, darkTheme.text],
  });
  const border = themeAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [lightTheme.border, darkTheme.border],
  });
  // TODO define different primary color for the themes
  const primary = themeAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [lightTheme.primary, darkTheme.primary],
  });

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeStyle: type === 'light' ? lightTheme : darkTheme,
        background,
        card,
        text,
        border,
        primary,
      }}>
      <StatusBar
        barStyle={currentTheme === 'light' ? 'dark-content' : 'light-content'}
      />
      {children}
    </ThemeContext.Provider>
  );
}
