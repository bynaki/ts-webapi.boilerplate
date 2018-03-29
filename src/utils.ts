import { ErrorWithStatusCode } from "./errors";

export function sendingErrorData(err: ErrorWithStatusCode): {
  data: null
  error: {
    message: string
    name: string
    stack: string
    status: number
  }
} {
  err.status = err.status || 500
  return {
    data: null,
    error: {
      message: err.message,
      name: err.name,
      stack: err.stack,
      status: err.status,
    },
  }
}
