import {useMutation, UseMutationResult} from '@tanstack/react-query';
import axios, {AxiosRequestConfig, AxiosError} from 'axios';

interface CallApiParams<T> {
  url: string;
  method: 'POST' | 'PUT' | 'DELETE'; // Specific methods for mutation
  params?: Record<string, string | number>;
  body?: Record<string, string | number>;
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: AxiosError) => void;
  };
}

export const useApiMutation = <T>({
  url,
  method,
  params = {},
  body = {},
  options = {},
}: CallApiParams<T>): UseMutationResult<T, AxiosError, unknown, unknown> => {
  const config: AxiosRequestConfig = {
    method,
    url,
    params, // Apply params for methods like PUT/DELETE that might need them
    data: body, // Apply body for POST/PUT
  };

  return useMutation<T, AxiosError, unknown, unknown>({
    mutationFn: () => axios(config).then(res => res.data),
    onSuccess: options.onSuccess,
    onError: options.onError, // onError expects AxiosError here
  });
};
