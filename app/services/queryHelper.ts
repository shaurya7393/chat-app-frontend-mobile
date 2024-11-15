import {useQuery, UseQueryResult} from '@tanstack/react-query';
import axios, {AxiosRequestConfig, AxiosError} from 'axios';

interface CallApiParams<T> {
  url: string;
  params?: Record<string, string | number>;
  options?: {
    enabled?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: AxiosError) => void;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  };
  queryKey?: string;
}

export const useApiQuery = <T>({
  url,
  params = {},
  options = {},
  queryKey,
}: CallApiParams<T>): UseQueryResult<T, AxiosError> => {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url,
    params, // Apply params for GET
  };

  const defaultOptions = {
    enabled: true,
    staleTime: 60000, // Default staleTime for caching
    refetchOnWindowFocus: false, // Default refetch on window focus behavior
    ...options,
  };

  return useQuery<T, AxiosError>({
    queryKey: [queryKey, params], // Unique queryKey
    queryFn: () => axios(config).then(res => res.data),
    enabled: defaultOptions.enabled,
    staleTime: defaultOptions.staleTime,
    refetchOnWindowFocus: defaultOptions.refetchOnWindowFocus,
  });
};
