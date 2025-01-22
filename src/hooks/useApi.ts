import { useState, useEffect, useRef, useCallback } from 'react';
import { ApiError } from '../services/api/errorHandler';
import { ERROR_MESSAGES } from '../services/api/errorMessages';

interface UseApiConfig<T> {
  defaultValue: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  cacheKey?: string;
  cacheDuration?: number;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();

export function useApi<T>(
  apiCall: (signal: AbortSignal) => Promise<T>,
  config: UseApiConfig<T>
) {
  const [data, setData] = useState<T>(config.defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController>();
  const isMountedRef = useRef(true);

  const fetchData = useCallback(async (ignoreCache = false) => {
    // Check cache first if we have a cache key
    if (!ignoreCache && config.cacheKey) {
      const cached = cache.get(config.cacheKey);
      if (cached && Date.now() - cached.timestamp < (config.cacheDuration || 5 * 60 * 1000)) {
        setData(cached.data);
        setLoading(false);
        setError(null);
        return;
      }
    }

    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      setLoading(true);
      setError(null);
      const result = await apiCall(signal);
      
      if (!signal.aborted && isMountedRef.current) {
        setData(result);
        
        // Cache the result if we have a cache key
        if (config.cacheKey) {
          cache.set(config.cacheKey, {
            data: result,
            timestamp: Date.now()
          });
        }
        
        config.onSuccess?.(result);
      }
    } catch (err) {
      if (!signal.aborted && isMountedRef.current) {
        // Handle specific error cases
        if (err instanceof ApiError) {
          if (err.isNotFound) {
            setData(config.defaultValue);
            setError(null);
            return;
          }
          if (err.isNetworkError) {
            setError(ERROR_MESSAGES.NETWORK_ERROR);
            return;
          }
        }

        const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.DEFAULT;
        setError(errorMessage);
        config.onError?.(err as Error);
      }
    } finally {
      if (!signal.aborted && isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [apiCall, config]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchData();
    
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const refetch = useCallback(() => fetchData(true), [fetchData]);

  return { 
    data, 
    loading, 
    error,
    refetch
  };
}