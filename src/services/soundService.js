import { sendPlayCommand } from "../controllers/streamController.js";
import { db } from "../db.js";
import { ResponseError, ResponseSuccess } from "../lib/response.js";

export const playSoundService = async (soundID) => {
    const sound = await db.sound.findUnique({ where: { id: soundID } });
    if (!sound) {
        throw ResponseError.notFound('song not found');
    }
    sendPlayCommand({
        action: 'play',
        type: 'single',
        file: sound.fileUrl
    });
    return ResponseSuccess.success();
};

export const getAllSoundsService = async () => {
    const sounds = await db.sound.findMany();
    return ResponseSuccess.success(sounds);
};

export const addSoundToPlaylistService = async (soundId, playlistId, body) => {

    const order = body?.order ?? null
    // Validate playlist and sound exist
    const playlist = await db.playlist.findUnique({ where: { id: playlistId } });
    if (!playlist) throw ResponseError.notFound('playlist not found');
    const sound = await db.sound.findUnique({ where: { id: soundId } });
    if (!sound) throw ResponseError.notFound('sound not found');

    // Check if sound already in playlist
    const exists = await db.playlistSound.findFirst({ where: { playlistId, soundId } });
    if (exists) throw ResponseError.conflict('sound already in playlist');

    // Get current sounds in playlist, ordered
    const current = await db.playlistSound.findMany({
        where: { playlistId },
        orderBy: { order: 'desc' } // descending for safe shifting
    });
    const maxOrder = current.length;
    let insertOrder = (typeof order === 'number' && order >= 0 && order <= maxOrder) ? order : maxOrder;

    // Shift orders >= insertOrder up by 1, one by one (descending)
    for (const item of current) {
        if (item.order >= insertOrder) {
            await db.playlistSound.update({
                where: { id: item.id },
                data: { order: item.order + 1 }
            });
        }
    }

    // Insert new sound at desired order
    await db.playlistSound.create({
        data: {
            playlistId,
            soundId,
            order: insertOrder,
            is_played: false
        }
    });

    return ResponseSuccess.success();
};