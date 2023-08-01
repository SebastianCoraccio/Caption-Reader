import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {StackParamList} from '../../../navigation';
import {useManifest} from '../../services/api';
import {VideoList} from './list';

export function VideoListScreen({
  route: {
    params: {folder},
  },
}: NativeStackScreenProps<StackParamList, 'VideoList'>) {
  const {data} = useManifest(folder);

  return <VideoList data={data} folder={folder} />;
}
