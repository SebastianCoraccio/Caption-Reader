import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PlayerScreen} from './src/features/player/screen';
import {unslug} from './src/services/unslug';
import {HomeScreen} from './src/features/home/screen';
import {VideoListScreen} from './src/features/video-list/screen';
import {useIsTablet} from './src/services/use-is-tablet';
import {AllScreen} from './src/features/tablet-layout/screen';
import {FuriganaToggle} from './src/lib/furigana-toggle';
import {ThemeContext} from './src/services/theme-context';

export type StackParamList = {
  Home: undefined;
  Player: {title: string; folder: string};
  VideoList: {folder: string};
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends StackParamList {}
  }
}

const Stack = createNativeStackNavigator<StackParamList>();

export function Navigation() {
  const {themeStyle} = useContext(ThemeContext);
  const isTablet = useIsTablet();
  const baseScreenStyles = {
    headerTintColor: themeStyle.text,
    headerStyle: {
      backgroundColor: themeStyle.background,
    },
  };

  if (isTablet) {
    return (
      <Stack.Navigator initialRouteName="Player">
        <Stack.Screen
          name="Player"
          component={AllScreen}
          options={{...baseScreenStyles, headerShown: false}}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{...baseScreenStyles, headerShown: false}}
      />
      <Stack.Screen
        name="VideoList"
        component={VideoListScreen}
        options={({route}) => ({
          ...baseScreenStyles,
          title: unslug(route.params.folder),
        })}
      />
      <Stack.Screen
        name="Player"
        component={PlayerScreen}
        options={({route}) => ({
          ...baseScreenStyles,
          title: unslug(route.params.title),
          headerRight: FuriganaToggle,
        })}
      />
    </Stack.Navigator>
  );
}
