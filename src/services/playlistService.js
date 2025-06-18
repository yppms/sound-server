import { db } from "../db.js";
import { ResponseError, ResponseSuccess } from "../lib/response.js";
import { sendCurrentPlaylistSound } from "./streamService.js";

export const getAllPlaylistsService = async () => {
  const playlists = await db.playlist.findMany(
    { include: 
      { 
        sounds: {
          include: {
            sound: true
          }
        }
      } 
    });
  return ResponseSuccess.success(playlists)
};

export const playTheListService = async (id) => {
  const playlists = await db.playlist.findUnique({
    where: {
      id
    }
  })
  if (!playlists) {
    throw ResponseError.notFound('playlist not found')
  }

    if (playlists.is_played) {
    throw ResponseError.conflict('playlist already played')
  }

  await db.playlist.updateMany({
    where: {
      is_played: true
    },
    data: {
      is_played: false
    }
  })

  await db.playlist.update({
    where: {
      id: playlists.id
    },
    data: {
      is_played: true
    }
  })

  await sendCurrentPlaylistSound()


  return ResponseSuccess.success()
};

