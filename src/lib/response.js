class ResponseError extends Error {
    constructor(status, message, data = null) {
        super(message)
        this.status = status
        this.data = data
    }

    static badRequest(message, data) {
        return new ResponseError(400, message, data)
    }

    static unauthorized(message, data) {
        return new ResponseError(401, message, data)
    }

    static forbidden(message, data) {
        return new ResponseError(403, message, data)
    }

    static notFound(message, data) {
        return new ResponseError(404, message, data)
    }

    static conflict(message, data) {
        return new ResponseError(409, message, data)
    }
}

class ResponseSuccess {
  constructor (status, data = null) {
    this.status = status
    this.data = {
      status: 'success',
      data
    }
  }

  static success (data) {
    return new ResponseSuccess(200, data)
  }

  static created (data) {
    return new ResponseSuccess(201, data)
  }

  static noContent (data) {
    return new ResponseSuccess(204, data)
  }
}


export { ResponseError, ResponseSuccess }
