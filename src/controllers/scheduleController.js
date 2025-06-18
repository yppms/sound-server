import { createScheduleService, getAllSchedulesService } from '../services/scheduleService.js';

export const createScheduleController = async (req, res, next) => {
  try {
    const result = await createScheduleService(req.params.id, req.body);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

export const getAllSchedulesController = async (req, res, next) => {
  try {
    const result = await getAllSchedulesService();
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};