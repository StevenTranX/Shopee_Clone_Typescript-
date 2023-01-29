import axios, { AxiosError } from 'axios'

export function isAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntityError(error: unknown) {
  return isAxiosError(error) && error.response?.status === 422
}
