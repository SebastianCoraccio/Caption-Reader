import {useEffect, useState} from 'react';
import {FileMetaData} from './api';
import {addListener, getData, removeListener, storeData} from './async-storage';

export type RecentFileMetaData = FileMetaData & {folder: string};

export const addRecent = async (video: RecentFileMetaData) => {
  const recents = await getData<FileMetaData[]>('recents');
  const filtered = (recents || []).filter(v => v.title !== video.title);
  filtered.unshift(video);
  await storeData('recents', filtered);
  return;
};

export const getRecents = async (): Promise<RecentFileMetaData[]> => {
  const recents = await getData<RecentFileMetaData[]>('recents');
  return (recents || []).slice(0, 8);
};

export function useRecents() {
  const [recents, setRecents] = useState<RecentFileMetaData[] | null>(null);

  async function setInitialRecents() {
    const recentsList = await getRecents();
    setRecents(recentsList);
  }

  useEffect(() => {
    setInitialRecents();

    function handleRecentsChange(newRecents: RecentFileMetaData[]) {
      setRecents(newRecents);
    }

    addListener('recents', handleRecentsChange);

    return () => {
      removeListener('recents', handleRecentsChange);
    };
  }, []);

  return recents;
}
