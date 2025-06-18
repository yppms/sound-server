import { ResponseError } from "../lib/response.js"

function cleanJoiMessage(msg) {
    // Replace all awkward quoted field names (e.g., "fieldName") with plain field names for any string
    let cleaned = msg.replace(/"([^"]+)"/g, '$1');
    // Keep lowercase
    return cleaned;
}

export const reqValidation = (schemas) => {
  return function (req, res, next) {
    for (const location in schemas) {
      const context = {
        ...req.params,
        ...req.query,
        ...req.body
      }
      const { error, value } = schemas[location].validate(req[location], {
        abortEarly: false,
        allowUnknown: false,
        context
      })
      if (error) {
        throw ResponseError.badRequest(cleanJoiMessage(error.message));
      }
      req[location] = value
    }
    next()
  }
}
