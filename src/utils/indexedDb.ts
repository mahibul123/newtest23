import { AppSettings, VideoMetadata, ShortClipConfig } from '../types';

const DB_NAME = 'ReelsnipAiDB';
const DB_VERSION = 1;

interface ReelsnipDBSchema {
  settings: AppSettings;
  videos: VideoMetadata;
  clips: ShortClipConfig;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains('videos')) {
        db.createObjectStore('videos', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('clips')) {
        db.createObjectStore('clips', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction('settings', 'readwrite');
    tx.objectStore('settings').put({ key, value });
  } catch (err) {
    console.warn('IndexedDB write failed, falling back to localStorage', err);
    localStorage.setItem(`reelsnip_${String(key)}`, JSON.stringify(value));
  }
}

export async function getSetting<K extends keyof AppSettings>(key: K, defaultValue: AppSettings[K]): Promise<AppSettings[K]> {
  try {
    const db = await openDB();
    const tx = db.transaction('settings', 'readonly');
    const request = tx.objectStore('settings').get(key);
    return new Promise((resolve) => {
      request.onsuccess = () => {
        if (request.result && request.result.value !== undefined) {
          resolve(request.result.value);
        } else {
          resolve(defaultValue);
        }
      };
      request.onerror = () => resolve(defaultValue);
    });
  } catch (err) {
    const stored = localStorage.getItem(`reelsnip_${String(key)}`);
    return stored ? JSON.parse(stored) : defaultValue;
  }
}

export async function saveVideoMeta(meta: VideoMetadata): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction('videos', 'readwrite');
    // Store metadata without the raw File object to avoid serializing bloat
    const cleanMeta = { ...meta, file: undefined };
    tx.objectStore('videos').put(cleanMeta);
  } catch (err) {
    console.error('Failed to save video metadata', err);
  }
}

export async function getAllVideoMetas(): Promise<VideoMetadata[]> {
  try {
    const db = await openDB();
    const tx = db.transaction('videos', 'readonly');
    const request = tx.objectStore('videos').getAll();
    return new Promise((resolve) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    });
  } catch (err) {
    return [];
  }
}

export async function deleteVideoMeta(id: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction('videos', 'readwrite');
    tx.objectStore('videos').delete(id);
  } catch (err) {
    console.error('Failed to delete video', err);
  }
}
