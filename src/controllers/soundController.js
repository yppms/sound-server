import { addSoundToPlaylistService, getAllSoundsService, playSoundService } from '../services/soundService.js';

export const getAllSoundsController = async (req, res, next) => {
  try {
    const result = await getAllSoundsService();
    res.status(result.status).json(result.data);
  } catch (e) {
    next(e);
  }
};

export const playSoundController = async (req, res, next) => {
  try {
    const result = await playSoundService(req.params.id);
    res.status(result.status).json(result.data);
  } catch (e) {
    next(e);
  }
};

export const addSoundToPlaylistController = async (req, res, next) => {
  try {
    const result = await addSoundToPlaylistService(req.params.id, req.params.playlistId, req.body);
    res.status(result.status).json(result.data);
  } catch (e) {
    next(e);
  }
};