export interface Response<T> {
  status: 'success' | 'fail' | 'error';
  data?: T;
  message?: string;
}
