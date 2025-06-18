import { sendPlayCommand } from '../controllers/streamController.js';
import { db } from '../db.js';


export async function sendCurrentPlaylistSound() {
  const playlist = await db.playlist.findFirst({ where: { is_played: true } });
  if (!playlist) return;
  const playlistSound = await db.playlistSound.findFirst({
    where: { playlistId: playlist.id, is_played: true },
    include: { sound: true }
  });
  if (playlistSound && playlistSound.sound) {
    sendPlayCommand({
      action: 'play',
      type: 'playlist',
      file: playlistSound.sound.fileUrl
    });
  }
}

export async function sendNextSound() {
  const playlist = await db.playlist.findFirst({ where: { is_played: true } });
  if (!playlist) return;

  // Get current playing sound
  const currentSound = await db.playlistSound.findFirst({
    where: { playlistId: playlist.id, is_played: true }
  });

  if (currentSound) {
    // Mark current sound as not playing
    await db.playlistSound.update({
      where: { id: currentSound.id },
      data: { is_played: false }
    });

    // Find next sound
    const nextSound = await db.playlistSound.findFirst({
      where: {
        playlistId: playlist.id,
        order: { gt: currentSound.order }
      },
      include: { sound: true },
      orderBy: { order: 'asc' }
    });

    if (nextSound) {
      // Mark next sound as playing and send command
      await db.playlistSound.update({
        where: { id: nextSound.id },
        data: { is_played: true }
      });

      sendPlayCommand({
        action: 'play',
        type: 'playlist',
        file: nextSound.sound.fileUrl
      });
    } else {
      // If no next sound found, get the first sound (loop back)
      const firstSound = await db.playlistSound.findFirst({
        where: { playlistId: playlist.id },
        include: { sound: true },
        orderBy: { order: 'asc' }
      });

      if (firstSound) {
        await db.playlistSound.update({
          where: { id: firstSound.id },
          data: { is_played: true }
        });

        sendPlayCommand({
          action: 'play',
          type: 'playlist',
          file: firstSound.sound.fileUrl
        });
      }
    }
  }
}
