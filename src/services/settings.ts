import {useEffect, useState} from 'react';
import {addListener, getData, removeListener, storeData} from './async-storage';

export interface Settings {
  theme: 'system' | 'light' | 'dark';
  furiganaVisible: boolean;
}

const defaultSettings: Settings = {
  theme: 'system',
  furiganaVisible: true,
};

export const updateSetting = async (update: Partial<Settings>) => {
  const settings = await getData<Settings>('settings');

  await storeData('settings', {...settings, ...update});
  return;
};

export const getSettings = async (): Promise<Settings> => {
  const settings = await getData<Settings>('settings');
  return settings || defaultSettings;
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  async function setInitialRecents() {
    const storedSettings = await getSettings();
    setSettings(storedSettings);
  }

  useEffect(() => {
    setInitialRecents();

    function handleSettingsChange(changedSettings: Settings) {
      setSettings(changedSettings);
    }

    addListener('settings', handleSettingsChange);

    return () => {
      removeListener('settings', handleSettingsChange);
    };
  }, []);

  return settings;
}
