import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../dashboard.service'

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => dashboardService.getSummary(),
  })
}
