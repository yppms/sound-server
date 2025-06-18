import { getAllPlaylistsService, playTheListService } from "../services/playlistService.js"

export const getAllPlaylistsController = async (req, res, next) => {
  try {
    const result = await getAllPlaylistsService()
    res.status(result.status).json(result.data)
  } catch (e) {
    next(e)
  }
}

export const playTheListController = async (req, res, next) => {
  try {
    const result = await playTheListService(req.params.id)
    res.status(result.status).json(result.data)
  } catch (e) {
    next(e)
  }
}


