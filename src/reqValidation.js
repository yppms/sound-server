import Joi from 'joi'


export const idParamSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required()
  })
}

export const addSoundToPlaylistSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
    playlistId: Joi.string().uuid().required()
  }),
  body: Joi.object({
    order: Joi.number().integer().positive().optional()
  })
}

export const scheduleSoundSchema = {
    params: Joi.object({
        id: Joi.string().uuid().required(),
    }),
    body: Joi.object({
        days: Joi.array().items(Joi.number().integer().min(0).max(6)).required(),
        hour: Joi.number().integer().min(0).max(23).required(),
        minute: Joi.number().integer().min(0).max(59).optional()
    })
}