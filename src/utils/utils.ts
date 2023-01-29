import { HttpStatusCode } from './../constants/httpStatusCode'
import axios, { AxiosError } from 'axios'

export function isAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}
