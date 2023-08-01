import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {StackParamList} from '../../../navigation';
import {Player} from './player';

export function PlayerScreen({
  route: {
    params: {title, folder},
  },
}: NativeStackScreenProps<StackParamList, 'Player'>) {
  return <Player title={title} folder={folder} />;
}
