import fs from 'fs';
import path from 'path';
import { db } from '../db.js';
import chokidar from 'chokidar';
import * as mm from 'music-metadata';

const mockDir = path.resolve('mock_sounds');

const SOUND_EXTENSIONS = ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a', '.mp4'];

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// Helper to capitalize each word
function capitalizeWords(str) {
  return str.replace(/-/g, ' ').replace(/\s+/g, ' ').trim().replace(/^[a-z]/, c => c.toUpperCase());
}

const ARTIST_FALLBACKS = [
  'Linkin Park', 'Dewa 19', 'Padi', 'Sheila On 7', 'Queen'
];

async function getArtistFromMetadata(filePath) {
  try {
    const metadata = await mm.parseFile(filePath);
    if (metadata.common && metadata.common.artist) {
      return metadata.common.artist;
    }
  } catch (e) {
    // ignore
  }
  // fallback
  return ARTIST_FALLBACKS[Math.floor(Math.random() * ARTIST_FALLBACKS.length)];
}

export const seedData = async () => {
  const files = fs.readdirSync(mockDir).filter(f => SOUND_EXTENSIONS.some(ext => f.toLowerCase().endsWith(ext)));
  const soundIds = [];
  for (const file of files) {
    const filePath = path.join(mockDir, file);
    const fileUrl = `http://localhost:${process.env.APP_PORT}/mock_sounds/${encodeURIComponent(file)}`;
    let sound = await db.sound.findFirst({ where: { fileUrl } });
    if (!sound) {
      let title;
      try {
        const metadata = await mm.parseFile(filePath);
        title = metadata.common && metadata.common.title ? capitalizeWords(metadata.common.title) : null;
      } catch (e) {
        title = null;
      }
      if (!title) {
        title = capitalizeWords(file.replace(/\.[^/.]+$/, ''));
      }
      const artist = await getArtistFromMetadata(filePath);
      sound = await db.sound.create({
        data: {
          title,
          artist,
          fileUrl,
        }
      });
    }
    soundIds.push(sound.id);
  }

  if (soundIds.length > 0) {
    let playedPlaylistIdx = Math.floor(Math.random() * 2) + 1; // randomly pick 1 or 2
    for (let i = 1; i <= 2; i++) {
      const name = `Playlist ${i}`;
      let playlist = await db.playlist.findFirst({ where: { name } });
      const isPlayed = i === playedPlaylistIdx;
      if (!playlist) {
        playlist = await db.playlist.create({
          data: {
            name,
            is_played: isPlayed
          }
        });
        // Randomly select a subset of sounds for this playlist (at least 1)
        const numSounds = Math.max(1, Math.floor(Math.random() * soundIds.length));
        const selectedSounds = shuffle([...soundIds]).slice(0, numSounds);
        for (let idx = 0; idx < selectedSounds.length; idx++) {
          await db.playlistSound.create({
            data: {
              playlistId: playlist.id,
              soundId: selectedSounds[idx],
              order: idx,
              is_played: idx === 0 ? true : false
            }
          });
        }
      }
    }
  }
};

// Helper to add a sound to DB
const addSoundToDb = async (filePath) => {
  const file = path.basename(filePath);
  const fileUrl = `http://localhost:${process.env.APP_PORT}/mock_sounds/${encodeURIComponent(file)}`;
  let sound = await db.sound.findFirst({ where: { fileUrl } });
  if (!sound) {
    let title;
    try {
      const metadata = await mm.parseFile(filePath);
      title = metadata.common && metadata.common.title ? capitalizeWords(metadata.common.title) : null;
    } catch (e) {
      title = null;
    }
    if (!title) {
      title = capitalizeWords(file.replace(/\.[^/.]+$/, ''));
    }
    const artist = await getArtistFromMetadata(filePath);
    await db.sound.create({
      data: {
        title,
        artist,
        fileUrl,
      }
    });
  }
};

// Helper to remove a sound from DB
const removeSoundFromDb = async (filePath) => {
  const file = path.basename(filePath);
  const fileUrl = `http://localhost:${process.env.APP_PORT}/mock_sounds/${encodeURIComponent(file)}`;
  const sound = await db.sound.findFirst({ where: { fileUrl } });
  if (sound) {
    await db.sound.delete({ where: { id: sound.id } });
  }
};

// Start watcher for mock_sounds folder
export const soundsWatcher = () => {
  const watcher = chokidar.watch(mockDir, { ignoreInitial: true });
  watcher
    .on('add', async filePath => {
      if (SOUND_EXTENSIONS.some(ext => filePath.toLowerCase().endsWith(ext))) {
        await addSoundToDb(filePath);
      }
    })
    .on('unlink', async filePath => {
      if (SOUND_EXTENSIONS.some(ext => filePath.toLowerCase().endsWith(ext))) {
        await removeSoundFromDb(filePath);
      }
    });
  return watcher;
};

