import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

/**
 * Example hook using TanStack Query for server state
 * Demonstrates loose coupling between data fetching and components
 */

interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
}

export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiClient.get<HealthResponse>('/health'),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}
