import { ResponseSuccess } from "../lib/response.js";

export const notFoundController = (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'API endpoint not found'
  });
};

export const pingPongController = async (req, res, next) => {
  try {
    const success = ResponseSuccess.success('pong')
    res.status(success.status).json(success.data)
  } catch (e) {
    next(e)
  }
}


