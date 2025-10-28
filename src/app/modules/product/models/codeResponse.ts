export interface ResponseSuccessfully<T> {
  message: string;
  data: T | T[];
}

export interface BadRequestError {
  name: string;
  message: string;
}
