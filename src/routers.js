import express from 'express';
import { addSoundToPlaylistController, getAllSoundsController, playSoundController } from './controllers/soundController.js';
import { getAllPlaylistsController, playTheListController } from './controllers/playlistController.js';
import { createScheduleController, getAllSchedulesController } from './controllers/scheduleController.js';
import { restAuthMiddleware } from './middleware/authMiddleware.js';
import { reqValidation } from './middleware/reqValidationMiddleware.js';
import { idParamSchema, addSoundToPlaylistSchema, scheduleSoundSchema } from './reqValidation.js';

const router = express.Router();

router.use('/mock_sounds', express.static('mock_sounds'));

router.get('/sounds', restAuthMiddleware, getAllSoundsController);
router.post('/sounds/:id/play', restAuthMiddleware, reqValidation(idParamSchema), playSoundController);
router.post('/sounds/:id/:playlistId/add', restAuthMiddleware, reqValidation(addSoundToPlaylistSchema), addSoundToPlaylistController);
router.post('/sounds/:id/schedule', restAuthMiddleware, reqValidation(scheduleSoundSchema), createScheduleController);
router.get('/sounds/schedule', restAuthMiddleware, getAllSchedulesController);

router.get('/playlists', restAuthMiddleware, getAllPlaylistsController);
router.post('/playlists/:id/play', restAuthMiddleware, reqValidation(idParamSchema), playTheListController);



export default router
