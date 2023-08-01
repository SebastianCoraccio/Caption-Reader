import {useEffect, useState} from 'react';
import {S3_STORAGE_BASE_URL} from '../../config';

export type ManifestType = 'video' | 'folder';
export interface CaptionInfo {
  timestamp: number;
  lines: Line[][];
}

export interface Line {
  text: string;
  reading?: string | null;
}

export interface FileMetaData {
  title: string;
  type: ManifestType;
  folder?: string;
}

export function useManifest(folder: string = '') {
  const [data, setData] = useState<FileMetaData[] | null>(null);

  useEffect(() => {
    fetch(`${S3_STORAGE_BASE_URL}${folder}.manifest.json`)
      .then(response => response.json())
      .then(setData);
  }, [folder]);

  return {data};
}

export function useCaptions(title: string, folder: string) {
  const [captions, setCaptions] = useState<CaptionInfo[] | null>(null);

  useEffect(() => {
    fetch(`${S3_STORAGE_BASE_URL}${folder}${title}.json`)
      .then(response => response.json())
      .then(result => setCaptions(result.captions));
  }, [title, folder]);
  return {captions};
}
