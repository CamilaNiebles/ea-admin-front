import { get } from '@/lib/api'
import type { DashboardSummary } from './dashboard.types'

export const dashboardService = {
  getSummary(): Promise<DashboardSummary> {
    return get<DashboardSummary>('/dashboard/summary')
  },
}
